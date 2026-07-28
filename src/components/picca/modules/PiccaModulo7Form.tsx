import {
  PiccaClinicalObservationTable,
  PiccaObjective,
  PiccaReadOnlyText,
  PiccaSection,
  PiccaTextField,
} from '../PiccaFields'
import styles from '../PiccaForm.module.css'
import {
  mergePiccaModulo7Answers,
  PICCA_MOD7_AFETO,
  PICCA_MOD7_ATENCAO,
  PICCA_MOD7_BRINCADEIRA,
  PICCA_MOD7_COMUNICACAO,
  PICCA_MOD7_IMPRESSAO_GERAL,
  PICCA_MOD7_INTERACAO,
  type PiccaModulo7Answers,
} from './piccaModulo7'

type Props = {
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  readOnly?: boolean
}

export function PiccaModulo7Form({ value, onChange, readOnly }: Props) {
  const answers = mergePiccaModulo7Answers(value)

  function set(patch: Partial<PiccaModulo7Answers>) {
    onChange({ ...answers, ...patch })
  }

  return (
    <div className={styles.form}>
      <PiccaObjective>
        Registar sistematicamente as observações comportamentais realizadas durante toda a avaliação,
        integrando-as posteriormente na formulação de caso.
      </PiccaObjective>

      <PiccaSection title="1. Impressão Geral">
        <PiccaClinicalObservationTable
          rows={[...PICCA_MOD7_IMPRESSAO_GERAL]}
          value={answers.impressaoGeral}
          onChange={(impressaoGeral) => set({ impressaoGeral })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="2. Comunicação e Linguagem">
        <PiccaClinicalObservationTable
          rows={[...PICCA_MOD7_COMUNICACAO]}
          value={answers.comunicacao}
          onChange={(comunicacao) => set({ comunicacao })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="3. Atenção e Atividade Motora">
        <PiccaClinicalObservationTable
          rows={[...PICCA_MOD7_ATENCAO]}
          value={answers.atencaoMotora}
          onChange={(atencaoMotora) => set({ atencaoMotora })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="4. Afeto e Humor">
        <PiccaClinicalObservationTable
          rows={[...PICCA_MOD7_AFETO]}
          value={answers.afetoHumor}
          onChange={(afetoHumor) => set({ afetoHumor })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="5. Interação Social">
        <PiccaClinicalObservationTable
          rows={[...PICCA_MOD7_INTERACAO]}
          value={answers.interacaoSocial}
          onChange={(interacaoSocial) => set({ interacaoSocial })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="6. Brincadeira e Exploração">
        <PiccaClinicalObservationTable
          rows={[...PICCA_MOD7_BRINCADEIRA]}
          value={answers.brincadeira}
          onChange={(brincadeira) => set({ brincadeira })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="Pérolas Clínicas">
        <PiccaReadOnlyText>
          {`• Observar o comportamento espontâneo antes do início formal da avaliação.
• Comparar o relato dos cuidadores com a observação direta.
• Registar discrepâncias entre diferentes contextos.`}
        </PiccaReadOnlyText>
      </PiccaSection>

      <PiccaSection title="Texto para Relatório">
        <PiccaTextField
          label="Observação clínica"
          value={answers.textoRelatorio}
          onChange={(textoRelatorio) => set({ textoRelatorio })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="Síntese Clínica">
        <PiccaTextField
          label="Pontos fortes"
          value={answers.sinteseFortes}
          onChange={(sinteseFortes) => set({ sinteseFortes })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Vulnerabilidades"
          value={answers.sinteseVulnerabilidades}
          onChange={(sinteseVulnerabilidades) => set({ sinteseVulnerabilidades })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Hipóteses diferenciais"
          value={answers.sinteseHipoteses}
          onChange={(sinteseHipoteses) => set({ sinteseHipoteses })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Provas complementares sugeridas"
          value={answers.sinteseProvas}
          onChange={(sinteseProvas) => set({ sinteseProvas })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>
    </div>
  )
}
