import { KitReadOnlyGuidance, KitStaticObjective } from './PiccaInteractiveKitTables'
import tableStyles from './PiccaInteractiveForm.module.css'
import {
  emptyComportamentoRegisto,
  mergePiccaInteractiveKitComportamentosAnswers,
  type ComportamentoRegisto,
} from './piccaInteractiveKitComportamentos'

type Props = {
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  readOnly?: boolean
}

const COLUMN_HEADERS = [
  {
    key: 'antecedente' as const,
    title: 'Antecedente',
    hint: 'O que aconteceu imediatamente antes? Qual foi a causa?',
  },
  {
    key: 'comportamento' as const,
    title: 'Comportamento',
    hint: 'O que a criança fez?',
  },
  {
    key: 'reacao' as const,
    title: 'Reação ao comportamento / estratégia utilizada',
    hint: 'Como reagiram?',
  },
  {
    key: 'consequencia' as const,
    title: 'Consequência / resultado da estratégia',
    hint: 'O que aconteceu a seguir?',
  },
]

export function PiccaInteractiveKitComportamentosForm({ value, onChange, readOnly }: Props) {
  const answers = mergePiccaInteractiveKitComportamentosAnswers(value)

  function setRegistos(registos: ComportamentoRegisto[]) {
    onChange({ ...answers, registos })
  }

  function updateRegisto(index: number, patch: Partial<ComportamentoRegisto>) {
    setRegistos(answers.registos.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  }

  return (
    <div className={tableStyles.formStack}>
      <KitStaticObjective>
        Registar situações do dia a dia para identificar padrões entre antecedentes, comportamentos,
        respostas parentais e consequências.
      </KitStaticObjective>

      <p className={tableStyles.note}>
        Exemplo: antecedente «Recusou-se a ir tomar banho» · comportamento «Grita» · reação «Fica
        sem ver TV depois do jantar» · consequência «Fica calmo e vai para o quarto».
      </p>

      <div className={tableStyles.tableScroll}>
        <table className={tableStyles.gridTable}>
          <thead>
            <tr>
              <th>#</th>
              {COLUMN_HEADERS.map((column) => (
                <th key={column.key}>
                  {column.title}
                  <span className={tableStyles.columnHint}>{column.hint}</span>
                </th>
              ))}
              {!readOnly && answers.registos.length > 1 ? <th /> : null}
            </tr>
          </thead>
          <tbody>
            {answers.registos.map((registo, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                {COLUMN_HEADERS.map((column) => (
                  <td key={column.key}>
                    <textarea
                      className={tableStyles.cellTextarea}
                      value={registo[column.key]}
                      disabled={readOnly}
                      rows={3}
                      onChange={(event) => updateRegisto(index, { [column.key]: event.target.value })}
                    />
                  </td>
                ))}
                {!readOnly && answers.registos.length > 1 ? (
                  <td>
                    <button type="button" onClick={() => setRegistos(answers.registos.filter((_, i) => i !== index))}>
                      Remover
                    </button>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!readOnly && (
        <button type="button" onClick={() => setRegistos([...answers.registos, emptyComportamentoRegisto()])}>
          Adicionar linha
        </button>
      )}

      <KitReadOnlyGuidance>
        Preencham a tabela ao longo da semana, sempre que ocorrer uma situação relevante. Procurem
        registar o que aconteceu antes, o comportamento observado, a resposta dos adultos e o
        resultado obtido. A análise conjunta com a terapeuta ajuda a identificar padrões e ajustar
        estratégias.
      </KitReadOnlyGuidance>
    </div>
  )
}
