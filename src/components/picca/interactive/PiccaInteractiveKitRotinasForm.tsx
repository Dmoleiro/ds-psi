import { PiccaSection, PiccaTextField } from '../PiccaFields'
import {
  KitReadOnlyGuidance,
  KitStaticObjective,
  PaiMaeWeekMatrix,
  RegistoDiarioTable,
} from './PiccaInteractiveKitTables'
import tableStyles from './PiccaInteractiveForm.module.css'
import {
  KIT_ROTINAS_MOMENTOS,
  KIT_ROTINAS_TASKS,
  mergePiccaInteractiveKitRotinasAnswers,
  type PiccaInteractiveKitRotinasAnswers,
} from './piccaInteractiveKitRotinas'

type Props = {
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  readOnly?: boolean
}

export function PiccaInteractiveKitRotinasForm({ value, onChange, readOnly }: Props) {
  const answers = mergePiccaInteractiveKitRotinasAnswers(value)
  function set(patch: Partial<PiccaInteractiveKitRotinasAnswers>) {
    onChange({ ...answers, ...patch })
  }

  return (
    <div className={tableStyles.formStack}>
      <KitStaticObjective>
        Promover previsibilidade, reduzir a sobrecarga parental, aumentar a participação de ambos os
        cuidadores e apoiar a autonomia e a autorregulação da criança.
      </KitStaticObjective>

      <PiccaSection title="1. Planeamento semanal das rotinas">
        <PaiMaeWeekMatrix
          rows={[...KIT_ROTINAS_TASKS]}
          value={answers.planeamento}
          onChange={(planeamento) => set({ planeamento })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="2. Registo diário">
        <RegistoDiarioTable
          rows={[...KIT_ROTINAS_MOMENTOS]}
          value={answers.registoDiario}
          onChange={(registoDiario) => set({ registoDiario })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="3. Observações">
        <PiccaTextField
          label="O que correu bem?"
          value={answers.observacoesBem}
          onChange={(observacoesBem) => set({ observacoesBem })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="O que foi difícil?"
          value={answers.observacoesDificil}
          onChange={(observacoesDificil) => set({ observacoesDificil })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Estratégia que ajudou"
          value={answers.observacoesEstrategia}
          onChange={(observacoesEstrategia) => set({ observacoesEstrategia })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <KitReadOnlyGuidance>
        Definam antecipadamente quem assegura cada tarefa. Mantenham instruções curtas e consistentes.
        Evitem substituir automaticamente a criança nas tarefas que já consegue realizar com supervisão.
      </KitReadOnlyGuidance>
    </div>
  )
}
