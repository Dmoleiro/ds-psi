import { PiccaReadOnlyText, PiccaSection, PiccaTextField } from '../../PiccaFields'
import styles from '../../PiccaForm.module.css'
import { mergePiccaVol6DisorderAnswers, type PiccaVol6DisorderAnswers } from './piccaVol6Answers'
import { PICCA_VOL6_BY_NUMBER } from './piccaVol6Content'
import { PiccaVol6ChecklistTable } from './PiccaVol6ChecklistTable'

type Props = {
  disorderNumber: number
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  readOnly?: boolean
}

export function PiccaVol6DisorderForm({ disorderNumber, value, onChange, readOnly }: Props) {
  const definition = PICCA_VOL6_BY_NUMBER[disorderNumber]
  const answers = mergePiccaVol6DisorderAnswers(disorderNumber, value)

  if (!definition) {
    return <p>Módulo não encontrado.</p>
  }

  function set(patch: Partial<PiccaVol6DisorderAnswers>) {
    onChange({ ...answers, ...patch })
  }

  return (
    <div className={styles.form}>
      {definition.guidance && <PiccaReadOnlyText>{definition.guidance}</PiccaReadOnlyText>}
      <PiccaReadOnlyText>
        Assinalar apenas indicadores sustentados por exemplos concretos. Registar frequência,
        intensidade, duração, contexto, impacto funcional e nível de evidência.
      </PiccaReadOnlyText>

      {definition.groups.map((group) => (
        <PiccaSection key={group.id} title={group.title}>
          <PiccaVol6ChecklistTable
            items={group.items}
            value={answers.indicadores}
            onChange={(indicadores) => set({ indicadores })}
            readOnly={readOnly}
          />
        </PiccaSection>
      ))}

      <PiccaSection title="Integração clínica">
        <PiccaTextField
          label="Diagnóstico diferencial e comorbilidades a explorar"
          value={answers.diagnosticoDiferencial}
          onChange={(diagnosticoDiferencial) => set({ diagnosticoDiferencial })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Instrumentos e fontes possíveis"
          value={answers.instrumentosFontes}
          onChange={(instrumentosFontes) => set({ instrumentosFontes })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Síntese clínica e hipótese provisória"
          value={answers.sinteseHipotese}
          onChange={(sinteseHipotese) => set({ sinteseHipotese })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>
    </div>
  )
}
