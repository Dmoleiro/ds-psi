import { PiccaSection, PiccaTextField } from '../PiccaFields'
import { KitReadOnlyGuidance, KitStaticObjective } from './PiccaInteractiveKitTables'
import tableStyles from './PiccaInteractiveForm.module.css'
import {
  KIT_FLEXIBILIDADE_DESAFIOS,
  KIT_FLEXIBILIDADE_ESCADA,
  mergePiccaInteractiveKitFlexibilidadeAnswers,
  type PiccaInteractiveKitFlexibilidadeAnswers,
} from './piccaInteractiveKitFlexibilidade'

type Props = {
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  readOnly?: boolean
}

export function PiccaInteractiveKitFlexibilidadeForm({ value, onChange, readOnly }: Props) {
  const answers = mergePiccaInteractiveKitFlexibilidadeAnswers(value)
  function set(patch: Partial<PiccaInteractiveKitFlexibilidadeAnswers>) {
    onChange({ ...answers, ...patch })
  }

  return (
    <div className={tableStyles.formStack}>
      <KitStaticObjective>
        Desenvolver a capacidade de adaptar-se a mudanças, aceitar alternativas e recuperar após
        frustrações, com apoio progressivo dos pais.
      </KitStaticObjective>

      <PiccaSection title="1. Desafios de flexibilidade">
        <div className={tableStyles.tableScroll}>
          <table className={tableStyles.gridTable}>
            <thead>
              <tr>
                <th>Desafio</th>
                <th>Conseguiu</th>
                <th>Com ajuda</th>
                <th>Recusou</th>
                <th>Pai</th>
                <th>Mãe</th>
              </tr>
            </thead>
            <tbody>
              {KIT_FLEXIBILIDADE_DESAFIOS.map((desafio) => {
                const row = answers.desafios[desafio.id]
                return (
                  <tr key={desafio.id}>
                    <th scope="row">{desafio.label}</th>
                    {(['conseguiu', 'comAjuda', 'recusou', 'pai', 'mae'] as const).map((field) => (
                      <td key={field}>
                        <input
                          type="checkbox"
                          checked={row?.[field] ?? false}
                          disabled={readOnly}
                          onChange={() =>
                            set({
                              desafios: {
                                ...answers.desafios,
                                [desafio.id]: { ...row, [field]: !row?.[field] },
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
      </PiccaSection>

      <PiccaSection title="2. Escada de progressão">
        {KIT_FLEXIBILIDADE_ESCADA.map((nivel) => (
          <PiccaTextField
            key={nivel.id}
            label={nivel.label}
            value={answers.escada[nivel.id] ?? ''}
            onChange={(text) => set({ escada: { ...answers.escada, [nivel.id]: text } })}
            readOnly={readOnly}
            multiline
          />
        ))}
      </PiccaSection>

      <PiccaSection title="3. Registo de situação">
        <PiccaTextField
          label="Situação registada"
          value={answers.situacao.situacao}
          onChange={(situacao) => set({ situacao: { ...answers.situacao, situacao } })}
          readOnly={readOnly}
          multiline
        />
        <label>
          <input
            type="checkbox"
            checked={answers.situacao.antecipacao}
            disabled={readOnly}
            onChange={() =>
              set({ situacao: { ...answers.situacao, antecipacao: !answers.situacao.antecipacao } })
            }
          />{' '}
          Foi usada antecipação visual ou verbal
        </label>
        <PiccaTextField
          label="Escolhas oferecidas"
          value={answers.situacao.escolhas}
          onChange={(escolhas) => set({ situacao: { ...answers.situacao, escolhas } })}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Resposta dos pais"
          value={answers.situacao.resposta}
          onChange={(resposta) => set({ situacao: { ...answers.situacao, resposta } })}
          readOnly={readOnly}
          multiline
        />
        <div className={tableStyles.fieldGrid}>
          <label>
            <input
              type="checkbox"
              checked={answers.situacao.pai}
              disabled={readOnly}
              onChange={() => set({ situacao: { ...answers.situacao, pai: !answers.situacao.pai } })}
            />{' '}
            Pai presente
          </label>
          <label>
            <input
              type="checkbox"
              checked={answers.situacao.mae}
              disabled={readOnly}
              onChange={() => set({ situacao: { ...answers.situacao, mae: !answers.situacao.mae } })}
            />{' '}
            Mãe presente
          </label>
        </div>
        <PiccaTextField
          label="Resultado"
          value={answers.situacao.resultado}
          onChange={(resultado) => set({ situacao: { ...answers.situacao, resultado } })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <KitReadOnlyGuidance>
        Antecipe mudanças com aviso prévio, ofereça escolhas limitadas e modele a flexibilidade no
        dia a dia. Celebrem pequenos avanços em vez de exigir mudanças completas de imediato.
      </KitReadOnlyGuidance>
    </div>
  )
}
