import { PiccaReadOnlyText, PiccaSection, PiccaTextField } from '../../PiccaFields'
import styles from '../../PiccaForm.module.css'
import { mergePiccaVol7DisorderAnswers, type PiccaVol7DisorderAnswers } from './piccaVol7Answers'
import { PICCA_VOL7_BY_NUMBER } from './piccaVol7Content'
import { PiccaVol7ChecklistTable } from './PiccaVol7ChecklistTable'

type Props = {
  disorderNumber: number
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  readOnly?: boolean
}

export function PiccaVol7DisorderForm({ disorderNumber, value, onChange, readOnly }: Props) {
  const definition = PICCA_VOL7_BY_NUMBER[disorderNumber]
  const answers = mergePiccaVol7DisorderAnswers(disorderNumber, value)

  if (!definition) {
    return <p>Módulo não encontrado.</p>
  }

  function set(patch: Partial<PiccaVol7DisorderAnswers>) {
    onChange({ ...answers, ...patch })
  }

  return (
    <div className={styles.form}>
      <PiccaReadOnlyText>{definition.chapterLabel}</PiccaReadOnlyText>
      {definition.guidance && <PiccaReadOnlyText>{definition.guidance}</PiccaReadOnlyText>}
      <PiccaReadOnlyText>
        Assinalar apenas indicadores sustentados por exemplos concretos. Registar frequência,
        intensidade, duração, contexto e impacto funcional.
      </PiccaReadOnlyText>

      {definition.groups.map((group) => (
        <PiccaSection key={group.id} title={group.title}>
          <PiccaVol7ChecklistTable
            items={group.items}
            threeColumn={definition.threeColumn}
            value={answers.indicadores}
            onChange={(indicadores) => set({ indicadores })}
            readOnly={readOnly}
          />
        </PiccaSection>
      ))}

      {definition.footerSections.map((section) => (
        <PiccaSection key={section.id} title={section.title}>
          {section.hint && <PiccaReadOnlyText>{section.hint}</PiccaReadOnlyText>}
          <PiccaTextField
            label={section.title}
            value={answers.footerSections[section.id] ?? ''}
            onChange={(next) =>
              set({
                footerSections: { ...answers.footerSections, [section.id]: next },
              })
            }
            readOnly={readOnly}
            multiline
          />
        </PiccaSection>
      ))}
    </div>
  )
}
