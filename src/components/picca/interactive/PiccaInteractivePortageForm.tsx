import { PiccaReadOnlyText, PiccaSection, PiccaTextField } from '../PiccaFields'
import styles from './PiccaInteractiveForm.module.css'
import {
  mergePiccaInteractivePortageAnswers,
  type PiccaInteractivePortageAnswers,
  type PortageItemAnswer,
  type PortageResultado,
} from './piccaInteractivePortage'
import {
  PICCA_PORTAGE_DOMAINS,
  PICCA_PORTAGE_GUIDANCE,
  PICCA_PORTAGE_USAGE_NOTES,
} from './portage/piccaPortageContent'

type Props = {
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  readOnly?: boolean
}

const RESULTADO_OPTIONS: Array<{ id: PortageResultado; label: string }> = [
  { id: '', label: '—' },
  { id: 's', label: 'S' },
  { id: 'n', label: 'N' },
  { id: 'av', label: 'AV' },
]

export function PiccaInteractivePortageForm({ value, onChange, readOnly }: Props) {
  const answers = mergePiccaInteractivePortageAnswers(value)

  function set(patch: Partial<PiccaInteractivePortageAnswers>) {
    onChange({ ...answers, ...patch })
  }

  function setItem(itemId: string, patch: Partial<PortageItemAnswer>) {
    const current = answers.itens[itemId] ?? { resultado: '', observacoes: '' }
    set({ itens: { ...answers.itens, [itemId]: { ...current, ...patch } } })
  }

  return (
    <div className={styles.formStack}>
      <PiccaReadOnlyText>
        Guia Portage de Educação Pré-Escolar — escala para avaliação e planeamento educativo.
        {PICCA_PORTAGE_GUIDANCE.map((line) => (
          <span key={line}>
            <br />
            {line}
          </span>
        ))}
      </PiccaReadOnlyText>

      <PiccaSection title="Identificação">
        <div className={styles.fieldGrid}>
          <PiccaTextField
            label="Nome do educando"
            value={answers.nomeEducando}
            onChange={(nomeEducando) => set({ nomeEducando })}
            readOnly={readOnly}
          />
          <PiccaTextField
            label="Data de nascimento"
            value={answers.dataNascimento}
            onChange={(dataNascimento) => set({ dataNascimento })}
            readOnly={readOnly}
          />
          <PiccaTextField
            label="Data da avaliação"
            value={answers.dataAvaliacao}
            onChange={(dataAvaliacao) => set({ dataAvaliacao })}
            readOnly={readOnly}
          />
          <PiccaTextField
            label="Avaliador(a)"
            value={answers.avaliador}
            onChange={(avaliador) => set({ avaliador })}
            readOnly={readOnly}
          />
        </div>
        <PiccaTextField
          label="Diagnóstico"
          value={answers.diagnostico}
          onChange={(diagnostico) => set({ diagnostico })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      {PICCA_PORTAGE_DOMAINS.map((domain) => (
        <details key={domain.id} className={styles.portageDomain} open>
          <summary className={styles.portageDomainTitle}>{domain.title}</summary>
          <div className={styles.portageDomainBody}>
            {domain.ageBands.map((band) => (
              <section key={band.id} className={styles.portageBand}>
                <h4 className={styles.portageBandTitle}>{band.ageLabel}</h4>
                <div className={styles.tableScroll}>
                  <table className={styles.gridTable}>
                    <thead>
                      <tr>
                        <th>N.º</th>
                        <th>Verificar se</th>
                        <th>S/N/AV</th>
                        <th>Observações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {band.items.map((item) => {
                        const row = answers.itens[item.id]
                        return (
                          <tr key={item.id}>
                            <td>{String(item.number).padStart(2, '0')}</td>
                            <td>{item.label}</td>
                            <td>
                              <select
                                value={row?.resultado ?? ''}
                                disabled={readOnly}
                                onChange={(e) =>
                                  setItem(item.id, {
                                    resultado: e.target.value as PortageResultado,
                                  })
                                }
                              >
                                {RESULTADO_OPTIONS.map((opt) => (
                                  <option key={opt.id || 'empty'} value={opt.id}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <input
                                type="text"
                                value={row?.observacoes ?? ''}
                                disabled={readOnly}
                                onChange={(e) =>
                                  setItem(item.id, { observacoes: e.target.value })
                                }
                              />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        </details>
      ))}

      <PiccaReadOnlyText>
        <strong>Orientações de utilização</strong>
        {PICCA_PORTAGE_USAGE_NOTES.map((line) => (
          <span key={line}>
            <br />• {line}
          </span>
        ))}
      </PiccaReadOnlyText>
    </div>
  )
}
