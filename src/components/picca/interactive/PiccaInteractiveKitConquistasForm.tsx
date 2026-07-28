import { PiccaSection, PiccaTextField } from '../PiccaFields'
import { KitReadOnlyGuidance, KitStaticObjective } from './PiccaInteractiveKitTables'
import tableStyles from './PiccaInteractiveForm.module.css'
import {
  mergePiccaInteractiveKitConquistasAnswers,
  type ConquistaComportamentoRow,
  type ConquistaMissao,
  type ConquistaRecompensa,
  type PiccaInteractiveKitConquistasAnswers,
} from './piccaInteractiveKitConquistas'
import { WEEKDAY_KEYS, WEEKDAY_LABELS } from './piccaInteractiveShared'

type Props = {
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  readOnly?: boolean
}

export function PiccaInteractiveKitConquistasForm({ value, onChange, readOnly }: Props) {
  const answers = mergePiccaInteractiveKitConquistasAnswers(value)

  function set(patch: Partial<PiccaInteractiveKitConquistasAnswers>) {
    onChange({ ...answers, ...patch })
  }

  function updateComportamento(index: number, patch: Partial<ConquistaComportamentoRow>) {
    set({
      comportamentos: answers.comportamentos.map((row, i) =>
        i === index ? { ...row, ...patch } : row,
      ),
    })
  }

  function updateMissao(index: number, patch: Partial<ConquistaMissao>) {
    set({
      missoesEspeciais: answers.missoesEspeciais.map((row, i) =>
        i === index ? { ...row, ...patch } : row,
      ),
    })
  }

  function updateRecompensa(index: number, patch: Partial<ConquistaRecompensa>) {
    set({
      recompensas: answers.recompensas.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    })
  }

  return (
    <div className={tableStyles.formStack}>
      <KitStaticObjective>
        Reforçar comportamentos desejados através de um sistema visual de conquistas, combinando
        autocolantes, missões especiais e recompensas acordadas em família.
      </KitStaticObjective>

      <PiccaSection title="1. Quadro de autocolantes">
        {answers.comportamentos.map((comportamento, index) => (
          <div key={index} className={tableStyles.readonlyBlock}>
            <PiccaTextField
              label={`Comportamento ${index + 1}`}
              value={comportamento.label}
              onChange={(label) => updateComportamento(index, { label })}
              readOnly={readOnly}
            />
            <div className={tableStyles.tableScroll}>
              <table className={tableStyles.gridTable}>
                <thead>
                  <tr>
                    <th>Dia</th>
                    <th>N.º autocolantes</th>
                    <th>Pai</th>
                    <th>Mãe</th>
                  </tr>
                </thead>
                <tbody>
                  {WEEKDAY_KEYS.map((day) => {
                    const cell = comportamento.dias[day]
                    return (
                      <tr key={day}>
                        <th scope="row">{WEEKDAY_LABELS[day]}</th>
                        <td>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={cell?.autocolantes ?? ''}
                            disabled={readOnly}
                            onChange={(e) =>
                              updateComportamento(index, {
                                dias: {
                                  ...comportamento.dias,
                                  [day]: { ...cell, autocolantes: e.target.value },
                                },
                              })
                            }
                          />
                        </td>
                        {(['pai', 'mae'] as const).map((field) => (
                          <td key={field}>
                            <input
                              type="checkbox"
                              checked={cell?.[field] ?? false}
                              disabled={readOnly}
                              onChange={() =>
                                updateComportamento(index, {
                                  dias: {
                                    ...comportamento.dias,
                                    [day]: { ...cell, [field]: !cell?.[field] },
                                  },
                                })
                              }
                            />
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {!readOnly && answers.comportamentos.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  set({
                    comportamentos: answers.comportamentos.filter((_, i) => i !== index),
                  })
                }
              >
                Remover comportamento
              </button>
            )}
          </div>
        ))}
        {!readOnly && (
          <button
            type="button"
            onClick={() =>
              set({
                comportamentos: [
                  ...answers.comportamentos,
                  mergePiccaInteractiveKitConquistasAnswers({}).comportamentos[0],
                ],
              })
            }
          >
            Adicionar comportamento
          </button>
        )}
      </PiccaSection>

      <PiccaSection title="2. Missões especiais">
        {answers.missoesEspeciais.map((missao, index) => (
          <div key={index} className={tableStyles.readonlyBlock}>
            <PiccaTextField
              label="Descrição da missão"
              value={missao.descricao}
              onChange={(descricao) => updateMissao(index, { descricao })}
              readOnly={readOnly}
              multiline
            />
            <div className={tableStyles.fieldGrid}>
              <PiccaTextField
                label="Data"
                value={missao.data}
                onChange={(data) => updateMissao(index, { data })}
                readOnly={readOnly}
              />
              <label>
                <input
                  type="checkbox"
                  checked={missao.concluida}
                  disabled={readOnly}
                  onChange={() => updateMissao(index, { concluida: !missao.concluida })}
                />{' '}
                Concluída
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={missao.pai}
                  disabled={readOnly}
                  onChange={() => updateMissao(index, { pai: !missao.pai })}
                />{' '}
                Pai
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={missao.mae}
                  disabled={readOnly}
                  onChange={() => updateMissao(index, { mae: !missao.mae })}
                />{' '}
                Mãe
              </label>
            </div>
            {!readOnly && answers.missoesEspeciais.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  set({
                    missoesEspeciais: answers.missoesEspeciais.filter((_, i) => i !== index),
                  })
                }
              >
                Remover missão
              </button>
            )}
          </div>
        ))}
        {!readOnly && (
          <button
            type="button"
            onClick={() =>
              set({
                missoesEspeciais: [
                  ...answers.missoesEspeciais,
                  mergePiccaInteractiveKitConquistasAnswers({}).missoesEspeciais[0],
                ],
              })
            }
          >
            Adicionar missão
          </button>
        )}
      </PiccaSection>

      <PiccaSection title="3. Recompensas combinadas">
        {answers.recompensas.map((recompensa, index) => (
          <div key={index} className={tableStyles.fieldGrid}>
            <PiccaTextField
              label="Objetivo (ex.: 5 autocolantes)"
              value={recompensa.objetivo}
              onChange={(objetivo) => updateRecompensa(index, { objetivo })}
              readOnly={readOnly}
            />
            <PiccaTextField
              label="Recompensa acordada"
              value={recompensa.recompensa}
              onChange={(text) => updateRecompensa(index, { recompensa: text })}
              readOnly={readOnly}
            />
            <label>
              <input
                type="checkbox"
                checked={recompensa.atingida}
                disabled={readOnly}
                onChange={() => updateRecompensa(index, { atingida: !recompensa.atingida })}
              />{' '}
              Objetivo atingido
            </label>
          </div>
        ))}
      </PiccaSection>

      <PiccaSection title="4. Registo dos pais">
        <PiccaTextField
          label="Observações da semana"
          value={answers.registoPais.observacoes}
          onChange={(observacoes) =>
            set({ registoPais: { ...answers.registoPais, observacoes } })
          }
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Como celebraram as conquistas?"
          value={answers.registoPais.celebracao}
          onChange={(celebracao) => set({ registoPais: { ...answers.registoPais, celebracao } })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Dificuldades ou ajustes necessários"
          value={answers.registoPais.dificuldades}
          onChange={(dificuldades) =>
            set({ registoPais: { ...answers.registoPais, dificuldades } })
          }
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <KitReadOnlyGuidance>
        Definam objetivos claros e alcançáveis, entreguem o reforço de forma imediata e consistente, e
        ajustem o sistema em conjunto com a criança. O foco deve estar no esforço e no progresso, não
        na perfeição.
      </KitReadOnlyGuidance>
    </div>
  )
}
