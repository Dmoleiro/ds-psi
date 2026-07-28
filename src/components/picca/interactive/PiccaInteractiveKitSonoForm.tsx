import { PiccaSection } from '../PiccaFields'
import { KitReadOnlyGuidance, KitStaticObjective } from './PiccaInteractiveKitTables'
import tableStyles from './PiccaInteractiveForm.module.css'
import {
  KIT_SONO_INDICADORES,
  KIT_SONO_ROTINA_STEPS,
  mergePiccaInteractiveKitSonoAnswers,
  type PiccaInteractiveKitSonoAnswers,
} from './piccaInteractiveKitSono'
import { WEEKDAY_KEYS, WEEKDAY_LABELS } from './piccaInteractiveShared'

type Props = {
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  readOnly?: boolean
}

export function PiccaInteractiveKitSonoForm({ value, onChange, readOnly }: Props) {
  const answers = mergePiccaInteractiveKitSonoAnswers(value)
  function set(patch: Partial<PiccaInteractiveKitSonoAnswers>) {
    onChange({ ...answers, ...patch })
  }

  return (
    <div className={tableStyles.formStack}>
      <KitStaticObjective>
        Identificar padrões de sono, fatores que dificultam o adormecer, respostas parentais aos
        despertares e estratégias que favorecem uma rotina previsível.
      </KitStaticObjective>

      <PiccaSection title="1. Rotina do sono">
        <div className={tableStyles.tableScroll}>
          <table className={tableStyles.gridTable}>
            <thead>
              <tr>
                <th>Etapa</th>
                <th>Pai</th>
                <th>Mãe</th>
                <th>Ambos</th>
                <th>Hora</th>
                <th>Concluído</th>
              </tr>
            </thead>
            <tbody>
              {KIT_SONO_ROTINA_STEPS.map((step) => {
                const row = answers.rotina[step.id]
                return (
                  <tr key={step.id}>
                    <th scope="row">{step.label}</th>
                    {(['pai', 'mae', 'ambos'] as const).map((field) => (
                      <td key={field}>
                        <input
                          type="checkbox"
                          checked={row?.responsavel?.[field] ?? false}
                          disabled={readOnly}
                          onChange={() => {
                            const resp = row?.responsavel ?? { pai: false, mae: false, ambos: false }
                            set({
                              rotina: {
                                ...answers.rotina,
                                [step.id]: {
                                  ...row,
                                  responsavel: { ...resp, [field]: !resp[field] },
                                },
                              },
                            })
                          }}
                        />
                      </td>
                    ))}
                    <td>
                      <input
                        type="time"
                        value={row?.hora ?? ''}
                        disabled={readOnly}
                        onChange={(e) =>
                          set({
                            rotina: {
                              ...answers.rotina,
                              [step.id]: { ...row, hora: e.target.value },
                            },
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={row?.concluido ?? false}
                        disabled={readOnly}
                        onChange={(e) =>
                          set({
                            rotina: {
                              ...answers.rotina,
                              [step.id]: { ...row, concluido: e.target.checked },
                            },
                          })
                        }
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </PiccaSection>

      <PiccaSection title="2. Registo semanal do sono">
        <div className={tableStyles.tableScroll}>
          <table className={tableStyles.gridTable}>
            <thead>
              <tr>
                <th>Dia</th>
                <th>Deitou-se</th>
                <th>Adormeceu</th>
                <th>Latência</th>
                <th>Despertares</th>
                <th>Acordou</th>
                <th>Pai</th>
                <th>Mãe</th>
              </tr>
            </thead>
            <tbody>
              {WEEKDAY_KEYS.map((day) => {
                const row = answers.registoSemanal[day]
                return (
                  <tr key={day}>
                    <th scope="row">{WEEKDAY_LABELS[day]}</th>
                    {(['deitou', 'adormeceu', 'latencia', 'despertares', 'acordou'] as const).map(
                      (field) => (
                        <td key={field}>
                          <input
                            type="text"
                            value={row?.[field] ?? ''}
                            disabled={readOnly}
                            placeholder={field === 'latencia' ? 'min' : 'HH:MM'}
                            onChange={(e) =>
                              set({
                                registoSemanal: {
                                  ...answers.registoSemanal,
                                  [day]: { ...row, [field]: e.target.value },
                                },
                              })
                            }
                          />
                        </td>
                      ),
                    )}
                    {(['pai', 'mae'] as const).map((field) => (
                      <td key={field}>
                        <input
                          type="checkbox"
                          checked={row?.acompanhamento?.[field] ?? false}
                          disabled={readOnly}
                          onChange={() => {
                            const acc = row?.acompanhamento ?? { pai: false, mae: false }
                            set({
                              registoSemanal: {
                                ...answers.registoSemanal,
                                [day]: {
                                  ...row,
                                  acompanhamento: { ...acc, [field]: !acc[field] },
                                },
                              },
                            })
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </PiccaSection>

      <PiccaSection title="3. Indicadores adicionais">
        <div className={tableStyles.tableScroll}>
          <table className={tableStyles.gridTable}>
            <thead>
              <tr>
                <th>Indicador</th>
                <th>Sim</th>
                <th>Não</th>
                <th>Pai</th>
                <th>Mãe</th>
                <th>Observações</th>
              </tr>
            </thead>
            <tbody>
              {KIT_SONO_INDICADORES.map((ind) => {
                const row = answers.indicadores[ind.id]
                return (
                  <tr key={ind.id}>
                    <th scope="row">{ind.label}</th>
                    {(['sim', 'nao', 'pai', 'mae'] as const).map((field) => (
                      <td key={field}>
                        <input
                          type="checkbox"
                          checked={row?.[field] ?? false}
                          disabled={readOnly}
                          onChange={() =>
                            set({
                              indicadores: {
                                ...answers.indicadores,
                                [ind.id]: { ...row, [field]: !row?.[field] },
                              },
                            })
                          }
                        />
                      </td>
                    ))}
                    <td>
                      <input
                        type="text"
                        value={row?.observacoes ?? ''}
                        disabled={readOnly}
                        onChange={(e) =>
                          set({
                            indicadores: {
                              ...answers.indicadores,
                              [ind.id]: { ...row, observacoes: e.target.value },
                            },
                          })
                        }
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </PiccaSection>

      <KitReadOnlyGuidance>
        Mantenham horários regulares, reduzam estimulação no final do dia e evitem negociações
        prolongadas após o início da rotina. Registem os dados sem críticas ou punições.
      </KitReadOnlyGuidance>
    </div>
  )
}
