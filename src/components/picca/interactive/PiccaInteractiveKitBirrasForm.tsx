import { PiccaSection, PiccaTextField } from '../PiccaFields'
import { KitReadOnlyGuidance, KitStaticObjective } from './PiccaInteractiveKitTables'
import tableStyles from './PiccaInteractiveForm.module.css'
import {
  KIT_BIRRAS_ESTRATEGIAS,
  mergePiccaInteractiveKitBirrasAnswers,
  type BirrasEpisodio,
} from './piccaInteractiveKitBirras'

type Props = {
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  readOnly?: boolean
}

export function PiccaInteractiveKitBirrasForm({ value, onChange, readOnly }: Props) {
  const answers = mergePiccaInteractiveKitBirrasAnswers(value)

  function setEpisodios(episodios: BirrasEpisodio[]) {
    onChange({ ...answers, episodios })
  }

  function updateEpisodio(index: number, patch: Partial<BirrasEpisodio>) {
    setEpisodios(answers.episodios.map((ep, i) => (i === index ? { ...ep, ...patch } : ep)))
  }

  return (
    <div className={tableStyles.formStack}>
      <KitStaticObjective>
        Compreender antecedentes, comportamentos, consequências e estratégias de co-regulação,
        permitindo identificar padrões e ajustar a resposta parental.
      </KitStaticObjective>

      {answers.episodios.map((episodio, index) => (
        <PiccaSection key={index} title={`Episódio ${index + 1}`}>
          <div className={tableStyles.fieldGrid}>
            <PiccaTextField label="Data" value={episodio.data} onChange={(data) => updateEpisodio(index, { data })} readOnly={readOnly} />
            <PiccaTextField label="Hora" value={episodio.hora} onChange={(hora) => updateEpisodio(index, { hora })} readOnly={readOnly} />
            <PiccaTextField label="Local" value={episodio.local} onChange={(local) => updateEpisodio(index, { local })} readOnly={readOnly} />
            <PiccaTextField label="Duração aproximada (min)" value={episodio.duracao} onChange={(duracao) => updateEpisodio(index, { duracao })} readOnly={readOnly} />
            <PiccaTextField label="Intensidade (1–5)" value={episodio.intensidade} onChange={(intensidade) => updateEpisodio(index, { intensidade })} readOnly={readOnly} />
          </div>

          <PiccaTextField label="Antes da birra — antecedente" value={episodio.antecedente} onChange={(antecedente) => updateEpisodio(index, { antecedente })} readOnly={readOnly} multiline />
          <PiccaTextField label="Durante a birra — comportamento" value={episodio.comportamento} onChange={(comportamento) => updateEpisodio(index, { comportamento })} readOnly={readOnly} multiline />
          <PiccaTextField label="Depois da birra — consequência" value={episodio.consequencia} onChange={(consequencia) => updateEpisodio(index, { consequencia })} readOnly={readOnly} multiline />

          <h4>Estratégias utilizadas</h4>
          <div className={tableStyles.tableScroll}>
            <table className={tableStyles.gridTable}>
              <thead>
                <tr>
                  <th>Estratégia</th>
                  <th>Pai</th>
                  <th>Mãe</th>
                  <th>Funcionou</th>
                  <th>Observações</th>
                </tr>
              </thead>
              <tbody>
                {KIT_BIRRAS_ESTRATEGIAS.map((est) => {
                  const row = episodio.estrategias[est.id]
                  return (
                    <tr key={est.id}>
                      <th scope="row">{est.label}</th>
                      {(['pai', 'mae'] as const).map((field) => (
                        <td key={field}>
                          <input
                            type="checkbox"
                            checked={row?.[field] ?? false}
                            disabled={readOnly}
                            onChange={() => {
                              const next = { ...episodio.estrategias }
                              next[est.id] = { ...row, [field]: !row?.[field] }
                              updateEpisodio(index, { estrategias: next })
                            }}
                          />
                        </td>
                      ))}
                      <td>
                        <select
                          value={row?.funcionou ?? ''}
                          disabled={readOnly}
                          onChange={(e) => {
                            const next = { ...episodio.estrategias }
                            next[est.id] = { ...row, funcionou: e.target.value as BirrasEpisodio['estrategias'][string]['funcionou'] }
                            updateEpisodio(index, { estrategias: next })
                          }}
                        >
                          <option value="">—</option>
                          <option value="sim">Sim</option>
                          <option value="parcial">Parcial</option>
                          <option value="nao">Não</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={row?.observacoes ?? ''}
                          disabled={readOnly}
                          onChange={(e) => {
                            const next = { ...episodio.estrategias }
                            next[est.id] = { ...row, observacoes: e.target.value }
                            updateEpisodio(index, { estrategias: next })
                          }}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className={tableStyles.fieldGrid}>
            <PiccaTextField label="Tempo até recuperar (min)" value={episodio.tempoRecuperar} onChange={(tempoRecuperar) => updateEpisodio(index, { tempoRecuperar })} readOnly={readOnly} />
            <PiccaTextField label="Retomou a atividade? (Sim/Não)" value={episodio.retomouAtividade} onChange={(retomouAtividade) => updateEpisodio(index, { retomouAtividade })} readOnly={readOnly} />
            <PiccaTextField label="Reparou o comportamento? (Sim/Não)" value={episodio.reparouComportamento} onChange={(reparouComportamento) => updateEpisodio(index, { reparouComportamento })} readOnly={readOnly} />
          </div>

          {!readOnly && answers.episodios.length > 1 && (
            <button type="button" onClick={() => setEpisodios(answers.episodios.filter((_, i) => i !== index))}>
              Remover episódio
            </button>
          )}
        </PiccaSection>
      ))}

      {!readOnly && (
        <button type="button" onClick={() => setEpisodios([...answers.episodios, mergePiccaInteractiveKitBirrasAnswers({}).episodios[0]])}>
          Adicionar episódio
        </button>
      )}

      <KitReadOnlyGuidance>
        Durante a birra, mantenham uma postura calma, usem poucas palavras e assegurem segurança. A
        análise realiza-se após o episódio e não no momento de maior ativação emocional.
      </KitReadOnlyGuidance>
    </div>
  )
}
