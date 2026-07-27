import {
  defaultPiccaInteractiveEstrategiasAnswers,
  type PiccaInteractiveEstrategiasAnswers,
  OBJETIVO_ROUTINES,
  RESPONSABILIDADE_ROUTINES,
  WEEKDAY_KEYS,
  WEEKDAY_LABELS,
  type WeekdayKey,
} from './piccaInteractiveEstrategias'
import { PiccaSection } from '../PiccaFields'
import styles from '../PiccaForm.module.css'
import tableStyles from './PiccaInteractiveForm.module.css'

type Props = {
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  readOnly?: boolean
}

function asAnswers(value: Record<string, unknown>): PiccaInteractiveEstrategiasAnswers {
  const defaults = defaultPiccaInteractiveEstrategiasAnswers()
  const incoming = value as Partial<PiccaInteractiveEstrategiasAnswers>
  return {
    responsabilidade: { ...defaults.responsabilidade, ...(incoming.responsabilidade ?? {}) },
    objetivos: { ...defaults.objetivos, ...(incoming.objetivos ?? {}) },
  }
}

export function PiccaInteractiveEstrategiasForm({ value, onChange, readOnly }: Props) {
  const answers = asAnswers(value)

  function update(next: PiccaInteractiveEstrategiasAnswers) {
    onChange(next as unknown as Record<string, unknown>)
  }

  function toggleResponsavel(routineId: string, day: WeekdayKey, field: 'pai' | 'mae') {
    if (readOnly) return
    const cell = answers.responsabilidade[routineId]?.[day] ?? { pai: false, mae: false }
    update({
      ...answers,
      responsabilidade: {
        ...answers.responsabilidade,
        [routineId]: {
          ...answers.responsabilidade[routineId],
          [day]: { ...cell, [field]: !cell[field] },
        },
      },
    })
  }

  function toggleObjetivo(routineId: string, field: keyof PiccaInteractiveEstrategiasAnswers['objetivos'][string]) {
    if (readOnly) return
    const cell = answers.objetivos[routineId] ?? { pai: false, mae: false, crianca: false, outro: false }
    update({
      ...answers,
      objetivos: {
        ...answers.objetivos,
        [routineId]: { ...cell, [field]: !cell[field] },
      },
    })
  }

  return (
    <div className={tableStyles.formStack}>
      <PiccaSection title="Mapa de corresponsabilização parental">
        <p className={styles.objective}>
          Este documento permite visualizar rapidamente quem fica responsável por cada tarefa,
          promovendo uma divisão equilibrada e consistente das rotinas da criança.
        </p>
        <div className={tableStyles.tableScroll}>
          <table className={tableStyles.gridTable}>
            <thead>
              <tr>
                <th>Rotina</th>
                {WEEKDAY_KEYS.map((day) => (
                  <th key={day}>{WEEKDAY_LABELS[day]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RESPONSABILIDADE_ROUTINES.map((routine) => (
                <tr key={routine.id}>
                  <th scope="row">{routine.label}</th>
                  {WEEKDAY_KEYS.map((day) => {
                    const active = routine.weekdays.includes(day)
                    const cell = answers.responsabilidade[routine.id]?.[day]
                    return (
                      <td key={day} className={!active ? tableStyles.inactiveCell : undefined}>
                        {!active ? (
                          '—'
                        ) : (
                          <div className={tableStyles.checkboxPair}>
                            <label>
                              <input
                                type="checkbox"
                                checked={cell?.pai ?? false}
                                disabled={readOnly}
                                onChange={() => toggleResponsavel(routine.id, day, 'pai')}
                              />
                              Pai
                            </label>
                            <label>
                              <input
                                type="checkbox"
                                checked={cell?.mae ?? false}
                                disabled={readOnly}
                                onChange={() => toggleResponsavel(routine.id, day, 'mae')}
                              />
                              Mãe
                            </label>
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PiccaSection>

      <PiccaSection title="Rotina diária (objetivos a melhorar)">
        <div className={tableStyles.tableScroll}>
          <table className={tableStyles.gridTable}>
            <thead>
              <tr>
                <th>Rotina</th>
                <th>Pai</th>
                <th>Mãe</th>
                <th>Criança</th>
                <th>Outro</th>
                <th>Objetivo terapêutico</th>
              </tr>
            </thead>
            <tbody>
              {OBJETIVO_ROUTINES.map((routine) => {
                const cell = answers.objetivos[routine.id]
                return (
                  <tr key={routine.id}>
                    <th scope="row">{routine.label}</th>
                    {(['pai', 'mae', 'crianca', 'outro'] as const).map((field) => (
                      <td key={field}>
                        <input
                          type="checkbox"
                          checked={cell?.[field] ?? false}
                          disabled={readOnly}
                          onChange={() => toggleObjetivo(routine.id, field)}
                          aria-label={`${routine.label} — ${field}`}
                        />
                      </td>
                    ))}
                    <td className={tableStyles.objectiveCell}>{routine.objetivo}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </PiccaSection>

      <section className={tableStyles.readonlyBlock}>
        <h3>Recomendações clínicas</h3>
        <ul>
          <li>O pai deve assumir diariamente 2 a 4 rotinas completas, em vez de apenas &quot;ajudar&quot; em partes da tarefa.</li>
          <li>A mãe deve evitar substituir o pai quando a criança protesta, desde que a situação seja segura.</li>
          <li>É expectável existir um aumento transitório das birras nas primeiras semanas; isso não significa que a estratégia esteja a falhar.</li>
          <li>O pai deve responder de forma calma, previsível e consistente, validando a emoção da criança sem desistir da rotina.</li>
          <li>Ambos os pais devem manter as mesmas regras e transmitir confiança na capacidade da criança para se adaptar.</li>
        </ul>
      </section>

      <section className={tableStyles.readonlyBlock}>
        <h3>Dicas para os pais</h3>
        <ol>
          <li>Criem rotinas previsíveis — as crianças sentem-se mais seguras quando sabem o que vai acontecer.</li>
          <li>O pai deve assumir rotinas completas (banho, jantar, história e deitar).</li>
          <li>Evitem trocar de adulto durante uma birra.</li>
          <li>Validem a emoção sem ceder ao comportamento.</li>
          <li>A mãe deve transmitir confiança no pai.</li>
          <li>O pai deve brincar diariamente 15–20 minutos com a criança.</li>
          <li>Sejam consistentes — a consistência ajuda a adaptação.</li>
          <li>Elogiem os pequenos progressos.</li>
          <li>Evitem críticas entre adultos à frente da criança.</li>
          <li>O objetivo é vinculação segura com ambos os cuidadores.</li>
        </ol>
      </section>
    </div>
  )
}
