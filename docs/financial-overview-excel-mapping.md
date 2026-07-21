# Financial overview — Excel mapping

Source workbook: [`reference/financial-overview-template.xlsx`](reference/financial-overview-template.xlsx)  
Reference sheet: **Registo semanal_junho e julho 2** (same structure on all registo sheets).

---

## Parameters (rows 4–6, column B)

| Cell | Label (PT) | Default | Used as |
|------|------------|---------|---------|
| B4 | Reserva Segurança Social | `0.15` (15%) | `socialSecurityRate` |
| B5 | Reserva IRS | `0.20` (20%) | `irsRate` |
| B6 | Objetivo de poupança | `0.10` (10%) | `savingsRate` |

Editable by **therapist** and **admin** in backoffice settings.

Technical note in Excel: SS rule described as simplified 15% of gross for independent workers (70% relevant income × 21.4% contributive rate). Platform stores the **configured %**, not the statutory formula.

---

## Per-session row (from row 10+)

| Col | Header | Platform source |
|-----|--------|-----------------|
| A | Mês | Derived from session date |
| B | Data início | `attendance.sessionDate` or `appointment.scheduledAt` |
| C | Rendimento bruto (€) | **`appointment.sessionFee`** (default €50, editable per consulta) |
| D | Reserva SS (€) | `C × B4` if reserves apply |
| E | Reserva IRS (€) | `C × B5` if reserves apply |
| F | Poupança (€) | `C × B6` if reserves apply |
| G | Total reservas (€) | `D + E + F` |
| H | Disponível real (€) | `C − G` (or `C` if no reserves) |
| I | Observações | Patient name + optional notes |
| J | Local / notas | `location.name`; `"sem recibo"` when applicable |

### Excel formulas (per row)

```
D = IF(C="", "", C * $B$4)
E = IF(C="", "", C * $B$5)
F = IF(C="", "", C * $B$6)
G = IF(C="", "", SUM(D:F))
H = IF(C="", "", C - G)
```

### TypeScript equivalent

```ts
function computeSessionFinancials(gross: number, rates: Rates) {
  if (gross <= 0) {
    return { gross: 0, socialSecurity: 0, irs: 0, savings: 0, totalReserves: 0, available: 0 }
  }
  const socialSecurity = roundMoney(gross * rates.socialSecurityRate)
  const irs = roundMoney(gross * rates.irsRate)
  const savings = roundMoney(gross * rates.savingsRate)
  const totalReserves = roundMoney(socialSecurity + irs + savings)
  const available = roundMoney(gross - totalReserves)
  return { gross, socialSecurity, irs, savings, totalReserves, available }
}
```

Use **2 decimal places**; Excel examples sometimes show rounded integers in display but formulas use full precision.

---

## Monthly totals

April/May sheet row 27 example:

```
C27 = SUM(C12:C26)   -- total gross
D27 = SUM(D12:D26)   -- total SS
... etc
```

Month summary = sum of all **realized** session rows in that calendar month.

---

## Paid presenças (confirmed)

| Attendance status | In gross income? | Apply SS / IRS / poupança? |
|-------------------|------------------|----------------------------|
| `present_paid` | Yes | **Yes** |
| `receipt_issued` | Yes | **Yes** |
| `present_unpaid` | No | — |
| `absent` | No | — |

`present_paid` and `receipt_issued` are treated identically for financial calculations.

Workshops use the same **consulta** model with a different `sessionFee` (e.g. €80).

---

## Variable session fees

Excel shows many gross values (€35, €40, €45, €50, €75, €80, €155, €200, etc.) — not a single price.

**Decision:** store **`sessionFee` on each `Appointment`**:

- Default **€50.00** on create (including recurring series)
- Therapist can change before save / on edit
- Migration sets **€50** on existing appointments
- Realized row uses fee from matching consulta for that patient + date

### Matching presença → consulta

For a paid attendance on `date` + `patientId`:

1. Find appointment same therapist, patient, calendar date
2. If multiple, prefer exact time match or single appointment that day
3. Use `appointment.sessionFee` as column C
4. If no appointment found: fallback **€50** + show warning in UI (reconciliation)

---

## Forecast (previsto)

Not in Excel today — **new platform feature**.

| Source | Rule |
|--------|------|
| Future `appointments` | `scheduledAt > today`, not yet paid |
| Gross per row | `appointment.sessionFee` |
| Reserves | Apply same % as settings (optional: show gross only for forecast) |
| Charts | Monthly bar: realizado vs previsto |

---

## Workshops

Excel row example: `workshops` in col I, €50 gross, reserves applied normally.

**Phase 1:** optional manual income line or exclude workshops until workshop payments exist in DB.

**Phase 2:** link workshop registrations if added later.

---

## Test fixtures (from Excel)

Use these for unit tests:

| Gross | applyReserves | SS (15%) | IRS (20%) | Poupança (10%) | Total res. | Disponível |
|-------|---------------|----------|-----------|----------------|------------|------------|
| 50 | yes | 7.5 | 10 | 5 | 22.5 | 27.5 |
| 40 | yes | 6 | 8 | 4 | 18 | 22 |
| 80 | yes | 12 | 16 | 8 | 36 | 44 |
| 63 | no | 0 | 0 | 0 | 0 | 63 |

Row references: junho R34 (€50), R11 (€40), R21 (€80), abril R14 (€63 sem recibo).

---

## UI column labels (PT)

Match Excel headers in the Finanças table:

1. Data  
2. Paciente  
3. Local  
4. Rendimento bruto (€)  
5. Reserva SS (€)  
6. Reserva IRS (€)  
7. Poupança (€)  
8. Total reservas (€)  
9. Disponível real (€)  
10. Observações  
