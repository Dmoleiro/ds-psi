# Financial overview (IRS & Segurança Social) — plan & requirements

**Status:** Implemented (Jul 2026).

**Related docs:**

- [`financial-overview-excel-mapping.md`](financial-overview-excel-mapping.md) — formulas, columns, test fixtures
- [`reference/financial-overview-template.xlsx`](reference/financial-overview-template.xlsx) — source workbook

---

## Overview

Therapists use an Excel spreadsheet to track gross income from sessions and calculate how much to set aside for **Segurança Social (15%)**, **IRS (20%)**, and **poupança (10%)**, leaving **disponível real** (what they can use).

**Goal:** replicate this in the backoffice, fed from **presenças** (realized) and **consultas** (forecast), with per-session fees on appointments.

**Access:** admin enables per therapist (`financialOverviewEnabled`).

---

## Confirmed decisions

| # | Decision |
|---|----------|
| 1 | Excel reference: sheet **Registo semanal_junho e julho 2** (same layout on all registo sheets) |
| 2 | **Only paid presenças** count toward realized income: `present_paid` and `receipt_issued` (treated the same) |
| 3 | Both paid statuses apply **full** SS / IRS / poupança reserves on gross |
| 4 | Workshops are tracked as **consultas** with a different `sessionFee` (no separate model) |
| 5 | Session price on **`Appointment.sessionFee`**, default **€50**, editable on create/edit |
| 6 | Recurring consultas inherit fee; migration backfills existing rows to €50 |
| 7 | **Forecast** from future consultas + **monthly charts** (realizado vs previsto) |
| 8 | Rates (15% / 20% / 10%) editable by **therapist and admin** |

---

## Excel logic (summary)

### Parameters

| Rate | Default | Excel cell |
|------|---------|------------|
| Segurança Social | 15% | B4 |
| IRS | 20% | B5 |
| Poupança | 10% | B6 |

### Per session row

```
reservaSS      = gross × 15%
reservaIRS      = gross × 20%
poupança        = gross × 10%
totalReservas   = SS + IRS + poupança
disponívelReal  = gross − totalReservas
```

### Example (€50 com recibo)

| Bruto | SS | IRS | Poupança | Total reservas | Disponível |
|-------|-----|-----|----------|----------------|------------|
| €50 | €7.50 | €10 | €5 | €22.50 | €27.50 |

See full mapping and test vectors in [`financial-overview-excel-mapping.md`](financial-overview-excel-mapping.md).

---

## Data model changes

### `User`

```prisma
financialOverviewEnabled Boolean @default(false) @map("financial_overview_enabled")
financialSettings        TherapistFinancialSettings?
```

### `Appointment` — **new field**

```prisma
sessionFee Decimal @default(50) @map("session_fee") @db.Decimal(10, 2)
```

Migration: `UPDATE appointments SET session_fee = 50 WHERE session_fee IS NULL` (or column default).

### `TherapistFinancialSettings`

```prisma
model TherapistFinancialSettings {
  id                    String   @id @default(uuid())
  therapistId           String   @unique @map("therapist_id")
  socialSecurityRate    Decimal  @default(0.15) @map("social_security_rate") @db.Decimal(5, 4)
  irsRate               Decimal  @default(0.20) @map("irs_rate") @db.Decimal(5, 4)
  savingsRate           Decimal  @default(0.10) @map("savings_rate") @db.Decimal(5, 4)
  defaultSessionFee     Decimal  @default(50) @map("default_session_fee") @db.Decimal(10, 2)
  updatedAt             DateTime @updatedAt @map("updated_at")

  therapist User @relation(...)
  @@map("therapist_financial_settings")
}
```

`defaultSessionFee` pre-fills new appointments; per-appointment `sessionFee` can still be overridden.

---

## Data flow

### Realized (from presenças)

```
present_paid / receipt_issued (same treatment)
        ↓
Match patient + date → Appointment.sessionFee
        ↓
computeSessionFinancials(fee, rates)
        ↓
Aggregate by month → summary + table rows
```

### Forecast (from consultas)

```
appointment.scheduledAt > today
        ↓
Use appointment.sessionFee as gross
        ↓
Apply reserves (configurable; default yes for forecast)
        ↓
Monthly chart: sum(realized) vs sum(forecast) per month
```

### Presença without matching consulta

- Use `defaultSessionFee` from settings (€50)
- Flag row in UI: *“Sem consulta associada”*

---

## API endpoints

### Admin

| Method | Path | Body / notes |
|--------|------|----------------|
| `PATCH` | `/api/admin/therapists/:id` | `financialOverviewEnabled: boolean` |
| `GET/PUT` | `/api/admin/therapists/:id/financial-settings` | rates + defaultSessionFee |

### Therapist (gated)

| Method | Path | Purpose |
|--------|------|---------|
| `GET/PUT` | `/api/therapist/financial/settings` | Own rates + default fee |
| `GET` | `/api/therapist/financial/overview?year=&month=` | Month summary |
| `GET` | `/api/therapist/financial/rows?year=&month=` | Session table (realized) |
| `GET` | `/api/therapist/financial/forecast?year=&month=` | Future consultas |
| `GET` | `/api/therapist/financial/charts?year=` | 12-month realizado vs previsto |

### Appointment API changes

- `createAppointment` / `updateAppointment` accept `sessionFee` (optional, default from settings)
- Recurring create: same `sessionFee` on all occurrences in series
- Response includes `sessionFee`

---

## UI plan

### Nav

**Finanças** — visible only if `financialOverviewEnabled`.

### Page `/backoffice/financial`

**Top:** month picker (like presenças)

**Summary cards** (link to detail sections):

| Card | Source |
|------|--------|
| Rendimento bruto | Σ gross |
| Total reservas | Σ SS + IRS + poupança |
| Disponível real | Σ available |
| Previsto (mês) | Σ forecast gross |

**Chart:** bar chart per month (last 6–12 months) — **Realizado** vs **Previsto**

**Table — Realizado** (Excel columns):

Data · Paciente · Local · Bruto · SS · IRS · Poupança · Total reservas · Disponível · Estado (Pago / Recibo)

**Table — Previsto** (optional tab or section below):

Future consultas not yet paid

**Settings** (therapist + admin):

- SS %, IRS %, Poupança %
- Default session fee (€50)
- Disclaimer: *Ferramenta de planeamento; não substitui aconselhamento fiscal.*

### Appointment form changes

- Field **Valor da consulta (€)** — pre-filled `50`, editable
- Shown on create, edit, recurring create
- Propagates to series when creating recurring block

### Admin therapists page

- Toggle **Acesso a finanças**
- Link **Configurar finanças** → rates for that therapist

---

## Implementation order (tomorrow)

### 1. Schema & migration (~1h)

- [ ] `financial_overview_enabled` on users
- [ ] `session_fee` on appointments + backfill 50
- [ ] `therapist_financial_settings` table
- [ ] Prisma generate + migrate

### 2. Appointment fee UI + API (~2h)

- [ ] `sessionFee` in schemas, create/update/recurrence
- [ ] Form field in `AppointmentsCalendar` (default 50)
- [ ] Migration deploy

### 3. Calculation engine (~2h)

- [ ] `api/src/services/financialOverview.ts`
- [ ] `computeSessionFinancials`, `getRealizedRows`, `getMonthSummary`, `getForecast`, `getYearCharts`
- [x] Tests from Excel fixtures (50, 40, 80)

### 4. API routes + access control (~1h)

- [ ] `requireFinancialOverviewEnabled` middleware
- [ ] Therapist + admin financial routes
- [ ] Admin toggle on therapists page

### 5. Finanças page (~3h)

- [ ] Summary cards (linked)
- [ ] Realized table
- [ ] Forecast section
- [ ] Monthly chart (reuse dashboard chart patterns)
- [ ] Settings panel

### 6. QA (~1h)

- [ ] Mark presença → Finanças updates
- [ ] Compare one week against Excel junho sheet
- [ ] Recurring consulta with custom fee

**Total estimate:** ~1–1.5 days

---

## Out of scope (phase 1)

- Export to Excel/PDF
- Month-close snapshots
- Coordinator access

---

## Success criteria

- Junho row (€50) matches Excel within €0.01
- Both `present_paid` and `receipt_issued` rows match the formula table
- Changing consulta fee updates forecast; marking presença updates realized
- Disabled therapist: no nav, API 403
