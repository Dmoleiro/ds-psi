# Google Calendar sync — plan & requirements

## Overview

Therapists currently schedule appointments in the backoffice **and** create a parallel event in Google Calendar, which is what gets sent to patients (invites/updates).

**Goal:** when an appointment is created, edited, or deleted in the platform, the linked Google Calendar event is kept in sync — so patients receive updated invites without duplicate manual work.

**Direction (phase 1):** one-way sync — **platform → Google Calendar**.

**Not in scope initially:** syncing edits made directly in Google back into the platform, or linking historical Google events created before integration.

---

## Current state

| Area | Today |
|------|--------|
| Appointments | Stored in `appointments` table only |
| Google integration | None (no OAuth, no event IDs) |
| Patient notification | Manual via Google Calendar invites |
| Recurrence | Platform stores one row per occurrence (`recurrence_group_id`) |
| Edit scopes | Single / following / entire series (already implemented) |

Relevant code:

- `api/src/services/appointments.ts` — create, update, delete
- `api/prisma/schema.prisma` — `Appointment` model
- `src/components/backoffice/AppointmentsCalendar.tsx` — UI

---

## Goals

1. Therapist connects their Google account once from the backoffice.
2. New appointments created in the platform also create a Google Calendar event.
3. Edits in the platform update the linked Google event (date, time, duration, title, location, notes).
4. Deletes in the platform remove (or cancel) the linked Google event.
5. Patient email is added as an attendee when available, so Google can send invite/update emails.
6. Failures are visible to the therapist (sync status), without blocking the core appointment save.

## Non-goals (phase 1)

- Two-way sync (Google → platform)
- Automatic matching of appointments created manually in Google before go-live
- Syncing to multiple calendars per therapist
- Replacing Google as the notification channel (we still rely on Google attendee emails)
- Microsoft Outlook / Apple Calendar

---

## Functional requirements

### FR-1 — Google account connection

- Therapist can **connect** and **disconnect** Google Calendar from profile/settings.
- OAuth uses Google Calendar scopes sufficient for create/update/delete events on the therapist’s primary (or chosen) calendar.
- Refresh token is stored securely server-side; access token is refreshed automatically.
- Connection status is shown in the UI (connected / not connected / error).

### FR-2 — Appointment create sync

- When sync is enabled and Google is connected, creating an appointment triggers `events.insert` on Google Calendar.
- On success, store `google_event_id` and `google_calendar_id` on the appointment row.
- If Google API fails, the appointment is still saved locally; sync status is set to `failed` with a retriable error.

### FR-3 — Appointment update sync

- Editing an appointment (single scope) calls `events.patch` using stored IDs.
- Editing a recurring series uses existing platform scopes (`single` / `following` / `series`) and updates the corresponding Google events **per appointment row** (see recurrence strategy below).
- Patient attendee list is updated if email changes.

### FR-4 — Appointment delete sync

- Deleting an appointment calls `events.delete` (or marks cancelled if we choose soft-delete semantics).
- Series delete scopes mirror platform behaviour.

### FR-5 — Event content mapping

| Platform field | Google Calendar field |
|----------------|----------------------|
| Patient name | `summary` (e.g. `Consulta — {fullName}`) |
| `scheduledAt` + `durationMinutes` | `start` / `end` (timezone: `Europe/Lisbon`) |
| Location name (+ address if available) | `location` |
| `notes` | `description` |
| Patient `email` or `email2` (configurable) | `attendees[]` |
| Therapist | Event owner (authenticated Google account) |

### FR-6 — Recurrence strategy (phase 1)

**Recommended:** one Google event per platform appointment row (no Google RRULE in MVP).

- Matches the current data model (each occurrence is its own row).
- “Esta e as seguintes” / “Toda a série” map cleanly to updating/deleting multiple rows and their linked Google events.
- Trade-off: more API calls for large series; acceptable within current limits.

**Phase 2 (optional):** single Google recurring event with RRULE for new series only — higher complexity, defer unless needed.

### FR-7 — Sync status & retry

- Each appointment exposes sync state: `pending` | `synced` | `failed` | `not_linked`.
- Therapist can **retry sync** for failed appointments from the calendar UI or appointment detail.
- Admin/therapist can see last sync error message (sanitised).

### FR-8 — Settings

Per therapist (or global default):

- Enable/disable Google sync
- Which patient email to prefer (`email` vs `email2`)
- Optional: send Google invite emails to patient (`sendUpdates=all` vs `none`)

---

## Non-functional requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | Google tokens encrypted at rest (e.g. AES with `GOOGLE_TOKEN_ENCRYPTION_KEY`) |
| NFR-2 | OAuth client secrets only on server; never exposed to frontend |
| NFR-3 | Sync failures must not roll back successful DB writes |
| NFR-4 | API rate limits: batch/recurse carefully; queue retries with backoff |
| NFR-5 | GDPR: document Google as sub-processor; patient email only sent when sync enabled |
| NFR-6 | Audit log of sync actions (optional phase 2) |

---

## Data model changes (high level)

### New model: `GoogleCalendarConnection`

Stores OAuth credentials per therapist.

```prisma
model GoogleCalendarConnection {
  id              String   @id @default(uuid())
  therapistId     String   @unique @map("therapist_id")
  googleEmail     String   @map("google_email")
  calendarId      String   @map("calendar_id")      // usually "primary"
  accessToken     String   @map("access_token") @db.Text   // encrypted
  refreshToken    String   @map("refresh_token") @db.Text  // encrypted
  tokenExpiresAt  DateTime @map("token_expires_at")
  scopes          String   @db.Text
  syncEnabled     Boolean  @default(true) @map("sync_enabled")
  sendInvites     Boolean  @default(true) @map("send_invites")
  preferredEmail  String   @default("email") @map("preferred_email") // "email" | "email2"
  connectedAt     DateTime @default(now()) @map("connected_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  therapist User @relation(fields: [therapistId], references: [id], onDelete: Cascade)

  @@map("google_calendar_connections")
}
```

### Extend `User`

```prisma
model User {
  // ...existing fields
  googleCalendarConnection GoogleCalendarConnection?
}
```

### Extend `Appointment`

```prisma
model Appointment {
  // ...existing fields

  googleCalendarId  String?   @map("google_calendar_id")
  googleEventId     String?   @map("google_event_id")
  googleSyncStatus  GoogleSyncStatus @default(not_linked) @map("google_sync_status")
  googleSyncedAt    DateTime? @map("google_synced_at")
  googleSyncError   String?   @map("google_sync_error") @db.Text

  @@index([googleSyncStatus])
}
```

### New enum

```prisma
enum GoogleSyncStatus {
  not_linked   // created before sync or sync disabled
  pending      // queued / in progress
  synced
  failed
}
```

### Optional (phase 2): `GoogleSyncLog`

For debugging and support.

```prisma
model GoogleSyncLog {
  id            String   @id @default(uuid())
  appointmentId String?  @map("appointment_id")
  therapistId   String   @map("therapist_id")
  action        String   // create | update | delete | retry
  status        String   // success | failure
  errorMessage  String?  @db.Text
  createdAt     DateTime @default(now()) @map("created_at")
}
```

---

## Architecture (high level)

```
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│ AppointmentsCalendar│────▶│  API (appointments)  │────▶│  MySQL (appointments)│
│ + Google settings   │     │  + googleCalendar svc │     │  + connections       │
└─────────────────────┘     └──────────┬───────────┘     └─────────────────────┘
                                       │
                                       │ after DB commit
                                       ▼
                            ┌──────────────────────┐
                            │ Google Calendar API  │
                            │ events.insert/patch/ │
                            │ delete               │
                            └──────────────────────┘
```

### New backend modules

| Module | Responsibility |
|--------|----------------|
| `api/src/services/googleCalendar.ts` | OAuth client, token refresh, event CRUD |
| `api/src/services/googleCalendarSync.ts` | Map appointment ↔ Google event; retry logic |
| `api/src/routes/googleCalendar.ts` | OAuth callback, connect/disconnect, status |
| `api/src/lib/google.ts` | Google API client factory |

### Hook points in existing flow

After successful DB operations in `appointments.ts`:

1. `createTherapistAppointment` → sync each created row
2. `updateTherapistAppointment` → sync each updated row
3. `deleteTherapistAppointment` → delete each linked Google event

Sync runs **asynchronously** (in-process queue for MVP; background job later if needed).

---

## API endpoints (new)

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/therapist/google-calendar/status` | Connection + sync settings |
| `GET` | `/api/therapist/google-calendar/connect` | Start OAuth (redirect URL) |
| `GET` | `/api/therapist/google-calendar/callback` | OAuth callback (server-handled) |
| `DELETE` | `/api/therapist/google-calendar/disconnect` | Revoke + delete connection |
| `PATCH` | `/api/therapist/google-calendar/settings` | `syncEnabled`, `sendInvites`, `preferredEmail` |
| `POST` | `/api/therapist/appointments/:id/google-sync/retry` | Manual retry |

Existing appointment endpoints unchanged; response may include `googleSyncStatus` for UI badges.

---

## Frontend changes (high level)

### Settings page (therapist profile area)

- “Ligar Google Calendar” / “Desligar”
- Toggle: sync appointments automatically
- Toggle: send invite emails to patients
- Show connected Google account email

### Appointments calendar

- Small badge on appointment cards: ✓ synced / ⚠ failed / — not linked
- Retry action on failed items
- Optional: warn when creating appointment if Google not connected

---

## Google Cloud setup (prerequisites)

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/).
2. Enable **Google Calendar API**.
3. Configure **OAuth consent screen** (internal if Google Workspace, external if personal Gmail — may require verification for production).
4. Create **OAuth 2.0 Web client** with redirect URI:
   - `https://api.danielasantos.work/api/therapist/google-calendar/callback`
   - `http://localhost:3001/api/therapist/google-calendar/callback` (local)
5. Scopes (minimum):
   - `https://www.googleapis.com/auth/calendar.events`
6. Environment variables:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
GOOGLE_TOKEN_ENCRYPTION_KEY=   # 32-byte random secret
```

---

## Phased rollout

### Phase 0 — Discovery & consent (0.5 day)

- Confirm therapists use personal Gmail vs Google Workspace
- Confirm patient invite workflow (who receives email, which address)
- Privacy note for GDPR documentation

### Phase 1 — MVP (≈ 1–2 weeks)

- [ ] Google Cloud project + OAuth
- [ ] `GoogleCalendarConnection` model + migration
- [ ] Extend `Appointment` with sync fields
- [ ] Connect/disconnect UI
- [ ] Sync on create / update / delete (single appointments)
- [ ] Sync status + manual retry
- [ ] Deploy + therapist onboarding

**MVP limitation:** recurring series sync uses per-row Google events (works, but more API calls).

### Phase 2 — Hardening (≈ 3–5 days)

- [ ] Full recurrence scope sync (following / series)
- [ ] `GoogleSyncLog` + admin visibility
- [ ] Better error messages (token revoked, event deleted in Google, etc.)
- [ ] Optional background job queue if volume grows

### Phase 3 — Optional future

- [ ] Two-way sync via Google push notifications (webhooks)
- [ ] Link existing Google events (manual “import” UI)
- [ ] Clinic-wide shared calendar (Google Workspace service account)

---

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Duplicate events if therapist still creates manually in Google | Training + “create only in platform” policy; show prominent connected status |
| Old appointments not linked | Accept for phase 1; optional manual retry creates new Google event |
| Token revoked / expired | Detect 401; mark connection invalid; prompt reconnect |
| Patient has no email | Save appointment; skip attendee; show warning in UI |
| Google event deleted manually | Retry recreates event; or mark `failed` with clear message |
| Recurring series complexity | Per-row Google events in MVP; revisit RRULE in phase 2 |
| OAuth verification delay (external app) | Start Google verification early; use test users during dev |

---

## Open questions (for therapist sign-off)

1. Should invites go to `email`, `email2`, or both?
2. Is one Google account per therapist sufficient, or does the clinic use a shared calendar?
3. For past appointments, do they want a one-off “create Google events for this month” tool?
4. If Google sync fails, should the UI warn before save or only after?
5. Should coordinators see sync status when viewing a therapist’s calendar?

---

## Effort summary

| Phase | Scope | Estimate |
|-------|--------|----------|
| Phase 1 MVP | OAuth, connect UI, create/update/delete sync, status/retry | **8–12 dev days** |
| Phase 2 | Recurrence hardening, logging, edge cases | **3–5 dev days** |
| Phase 3 | Two-way sync, import | **TBD** |

*Estimates assume one developer familiar with the codebase; add time for Google OAuth verification if publishing to external users.*

---

## Success criteria

- Therapist connects Google once and stops double-entering new appointments
- Editing date/time in the platform updates the patient’s Google invite within ~1 minute
- Failed syncs are visible and retriable without data loss
- No regression to appointment CRUD when Google is down or disconnected
