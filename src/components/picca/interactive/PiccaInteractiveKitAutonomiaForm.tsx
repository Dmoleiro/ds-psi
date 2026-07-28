import { PiccaSection, PiccaTextField } from '../PiccaFields'
import { KitReadOnlyGuidance, KitStaticObjective } from './PiccaInteractiveKitTables'
import tableStyles from './PiccaInteractiveForm.module.css'
import {
  KIT_AUTONOMIA_COMPETENCIAS,
  mergePiccaInteractiveKitAutonomiaAnswers,
  type PiccaInteractiveKitAutonomiaAnswers,
} from './piccaInteractiveKitAutonomia'
import { WEEKDAY_KEYS, WEEKDAY_LABELS } from './piccaInteractiveShared'

type Props = {
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  readOnly?: boolean
}

export function PiccaInteractiveKitAutonomiaForm({ value, onChange, readOnly }: Props) {
  const answers = mergePiccaInteractiveKitAutonomiaAnswers(value)
  function set(patch: Partial<PiccaInteractiveKitAutonomiaAnswers>) {
    onChange({ ...answers, ...patch })
  }

  return (
    <div className={tableStyles.formStack}>
      <KitStaticObjective>
        Aumentar a participação da criança nas tarefas pessoais e domésticas, ajustando o nível de
        ajuda e reforçando a iniciativa e o esforço.
      </KitStaticObjective>

      <PiccaSection title="1. Competências de autonomia">
        <div className={tableStyles.tableScroll}>
          <table className={tableStyles.gridTable}>
            <thead>
              <tr>
                <th>Competência</th>
                <th>Sozinho</th>
                <th>Com ajuda</th>
                <th>Recusou</th>
                <th>Pai</th>
                <th>Mãe</th>
              </tr>
            </thead>
            <tbody>
              {KIT_AUTONOMIA_COMPETENCIAS.map((comp) => {
                const row = answers.competencias[comp.id]
                return (
                  <tr key={comp.id}>
                    <th scope="row">{comp.label}</th>
                    {(['sozinho', 'comAjuda', 'recusou', 'pai', 'mae'] as const).map((field) => (
                      <td key={field}>
                        <input
                          type="checkbox"
                          checked={row?.[field] ?? false}
                          disabled={readOnly}
                          onChange={() =>
                            set({
                              competencias: {
                                ...answers.competencias,
                                [comp.id]: { ...row, [field]: !row?.[field] },
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

      <PiccaSection title="2. Plano gradual de aprendizagem">
        <PiccaTextField label="Objetivo escolhido" value={answers.planoGradual.objetivo} onChange={(objetivo) => set({ planoGradual: { ...answers.planoGradual, objetivo } })} readOnly={readOnly} multiline />
        <PiccaTextField label="Passo 1" value={answers.planoGradual.passo1} onChange={(passo1) => set({ planoGradual: { ...answers.planoGradual, passo1 } })} readOnly={readOnly} />
        <PiccaTextField label="Passo 2" value={answers.planoGradual.passo2} onChange={(passo2) => set({ planoGradual: { ...answers.planoGradual, passo2 } })} readOnly={readOnly} />
        <PiccaTextField label="Passo 3" value={answers.planoGradual.passo3} onChange={(passo3) => set({ planoGradual: { ...answers.planoGradual, passo3 } })} readOnly={readOnly} />
        <PiccaTextField label="Reforço" value={answers.planoGradual.reforco} onChange={(reforco) => set({ planoGradual: { ...answers.planoGradual, reforco } })} readOnly={readOnly} multiline />
      </PiccaSection>

      <PiccaSection title="3. Registo semanal">
        <div className={tableStyles.tableScroll}>
          <table className={tableStyles.gridTable}>
            <thead>
              <tr>
                <th>Dia</th>
                <th>Tarefa treinada</th>
                <th>Nível de ajuda</th>
                <th>Pai</th>
                <th>Mãe</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              {WEEKDAY_KEYS.map((day) => {
                const row = answers.registoSemanal[day]
                return (
                  <tr key={day}>
                    <th scope="row">{WEEKDAY_LABELS[day]}</th>
                    <td>
                      <input type="text" value={row?.tarefa ?? ''} disabled={readOnly} onChange={(e) => set({ registoSemanal: { ...answers.registoSemanal, [day]: { ...row, tarefa: e.target.value } } })} />
                    </td>
                    <td>
                      <select value={row?.ajuda ?? ''} disabled={readOnly} onChange={(e) => set({ registoSemanal: { ...answers.registoSemanal, [day]: { ...row, ajuda: e.target.value } } })}>
                        <option value="">—</option>
                        <option value="nenhuma">Nenhuma</option>
                        <option value="verbal">Verbal</option>
                        <option value="gestual">Gestual</option>
                        <option value="fisica">Física</option>
                      </select>
                    </td>
                    {(['pai', 'mae'] as const).map((field) => (
                      <td key={field}>
                        <input type="checkbox" checked={row?.[field] ?? false} disabled={readOnly} onChange={() => set({ registoSemanal: { ...answers.registoSemanal, [day]: { ...row, [field]: !row?.[field] } } })} />
                      </td>
                    ))}
                    <td>
                      <select value={row?.resultado ?? ''} disabled={readOnly} onChange={(e) => set({ registoSemanal: { ...answers.registoSemanal, [day]: { ...row, resultado: e.target.value } } })}>
                        <option value="">—</option>
                        <option value="conseguiu">Conseguiu</option>
                        <option value="tentou">Tentou</option>
                        <option value="recusou">Recusou</option>
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </PiccaSection>

      <KitReadOnlyGuidance>
        Dividam a tarefa em passos pequenos, ofereçam apenas a ajuda necessária e reduzam-na
        progressivamente. Valorizem a tentativa, mesmo quando a execução ainda não é completa.
      </KitReadOnlyGuidance>
    </div>
  )
}
