import {
  defaultPiccaInteractiveSonoAnswers,
  type PiccaInteractiveSonoAnswers,
} from './piccaInteractiveSono'
import { PiccaSection, PiccaTextField } from '../PiccaFields'
import styles from '../PiccaForm.module.css'
import layoutStyles from './PiccaInteractiveForm.module.css'

type Props = {
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  readOnly?: boolean
}

function asAnswers(value: Record<string, unknown>): PiccaInteractiveSonoAnswers {
  return { ...defaultPiccaInteractiveSonoAnswers(), ...(value as Partial<PiccaInteractiveSonoAnswers>) }
}

export function PiccaInteractiveSonoForm({ value, onChange, readOnly }: Props) {
  const answers = asAnswers(value)

  function patch(partial: Partial<PiccaInteractiveSonoAnswers>) {
    onChange({ ...answers, ...partial })
  }

  return (
    <div className={layoutStyles.formStack}>
      <PiccaSection title="Rituais do sono — avaliação diária">
        <p className={layoutStyles.note}>
          Sempre que se alterarem as rotinas devemos manter essa alteração durante algum tempo —
          consistência.
        </p>
        <div className={layoutStyles.fieldGrid}>
          <div className={styles.field}>
            <label>Hora de início do ritual do sono</label>
            <input
              type="time"
              value={answers.horaInicio}
              onChange={(event) => patch({ horaInicio: event.target.value })}
              readOnly={readOnly}
              disabled={readOnly}
            />
          </div>
          <div className={styles.field}>
            <label>Hora final do ritual do sono</label>
            <input
              type="time"
              value={answers.horaFim}
              onChange={(event) => patch({ horaFim: event.target.value })}
              readOnly={readOnly}
              disabled={readOnly}
            />
          </div>
        </div>
        <PiccaTextField
          label="1º passo do ritual"
          value={answers.passo1}
          onChange={(passo1) => patch({ passo1 })}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="2º passo do ritual"
          value={answers.passo2}
          onChange={(passo2) => patch({ passo2 })}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="3º passo do ritual"
          value={answers.passo3}
          onChange={(passo3) => patch({ passo3 })}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Dificuldades no ritual / coisas que não resultaram"
          value={answers.dificuldades}
          onChange={(dificuldades) => patch({ dificuldades })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Melhorias / conquistas"
          value={answers.melhorias}
          onChange={(melhorias) => patch({ melhorias })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>
    </div>
  )
}
