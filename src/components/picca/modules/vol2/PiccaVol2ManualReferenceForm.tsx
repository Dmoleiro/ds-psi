import { PiccaReadOnlyText, PiccaSection, PiccaTextField } from '../../PiccaFields'
import styles from '../../PiccaForm.module.css'
import manualStyles from '../vol7/PiccaVol7ManualReferenceForm.module.css'
import {
  mergePiccaVol2ManualReferenceAnswers,
  type PiccaVol2ManualReferenceAnswers,
} from './piccaVol2ManualAnswers'
import {
  PICCA_VOL2_MANUAL_CHAPTERS,
  PICCA_VOL2_MANUAL_PREFACE,
  PICCA_VOL2_MANUAL_TITLE,
} from './piccaVol2ManualContent'

type Props = {
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  readOnly?: boolean
}

function renderBody(body: string) {
  return body.split('\n\n').map((paragraph, index) => {
    const trimmed = paragraph.trim()
    if (!trimmed) return null
    if (trimmed.startsWith('•')) {
      const items = trimmed.split('\n').filter((line) => line.trim())
      return (
        <ul key={index} className={manualStyles.list}>
          {items.map((item) => (
            <li key={item}>{item.replace(/^•\s*/, '')}</li>
          ))}
        </ul>
      )
    }
    return (
      <p key={index} className={manualStyles.paragraph}>
        {trimmed}
      </p>
    )
  })
}

export function PiccaVol2ManualReferenceForm({ value, onChange, readOnly }: Props) {
  const answers = mergePiccaVol2ManualReferenceAnswers(value)

  function set(patch: Partial<PiccaVol2ManualReferenceAnswers>) {
    onChange({ ...answers, ...patch })
  }

  return (
    <div className={styles.form}>
      <PiccaReadOnlyText>
        Referência clínica do Manual dos Marcos do Desenvolvimento (PICCA Volume II). Conteúdo
        informativo para apoio à avaliação — não substitui instrumentos padronizados nem julgamento
        clínico.
      </PiccaReadOnlyText>

      <PiccaSection title={PICCA_VOL2_MANUAL_TITLE}>
        <details className={manualStyles.chapter} open>
          <summary className={manualStyles.chapterTitle}>Ficha técnica e finalidade</summary>
          <div className={manualStyles.chapterBody}>{renderBody(PICCA_VOL2_MANUAL_PREFACE)}</div>
        </details>

        {PICCA_VOL2_MANUAL_CHAPTERS.map((chapter) => (
          <details key={chapter.number} className={manualStyles.chapter}>
            <summary className={manualStyles.chapterTitle}>
              {chapter.number}. {chapter.title}
            </summary>
            <div className={manualStyles.chapterBody}>{renderBody(chapter.body)}</div>
          </details>
        ))}
      </PiccaSection>

      <PiccaSection title="Notas clínicas da consulta">
        <PiccaTextField
          label="Registo pessoal do terapeuta enquanto consulta o manual"
          value={answers.notasClinicas}
          onChange={(notasClinicas) => set({ notasClinicas })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>
    </div>
  )
}
