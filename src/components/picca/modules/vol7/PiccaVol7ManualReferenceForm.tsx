import { PiccaReadOnlyText, PiccaSection, PiccaTextField } from '../../PiccaFields'
import styles from '../../PiccaForm.module.css'
import manualStyles from './PiccaVol7ManualReferenceForm.module.css'
import {
  mergePiccaVol7ManualReferenceAnswers,
  type PiccaVol7ManualReferenceAnswers,
} from './piccaVol7ManualAnswers'
import {
  PICCA_VOL7_MANUAL_CHAPTERS,
  PICCA_VOL7_MANUAL_PREFACE,
  PICCA_VOL7_MANUAL_TITLE,
} from './piccaVol7ManualContent'

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

export function PiccaVol7ManualReferenceForm({ value, onChange, readOnly }: Props) {
  const answers = mergePiccaVol7ManualReferenceAnswers(value)

  function set(patch: Partial<PiccaVol7ManualReferenceAnswers>) {
    onChange({ ...answers, ...patch })
  }

  return (
    <div className={styles.form}>
      <PiccaReadOnlyText>
        Referência clínica do Manual de Diagnóstico em Idade Pré-Escolar (PICCA). Conteúdo
        informativo para apoio à avaliação — não substitui os critérios oficiais do DC:0–5™.
      </PiccaReadOnlyText>

      <PiccaSection title={PICCA_VOL7_MANUAL_TITLE}>
        <details className={manualStyles.chapter} open>
          <summary className={manualStyles.chapterTitle}>Prefácio</summary>
          <div className={manualStyles.chapterBody}>{renderBody(PICCA_VOL7_MANUAL_PREFACE)}</div>
        </details>

        {PICCA_VOL7_MANUAL_CHAPTERS.map((chapter) => (
          <details key={chapter.number} className={manualStyles.chapter}>
            <summary className={manualStyles.chapterTitle}>
              Capítulo {chapter.number} — {chapter.title}
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
