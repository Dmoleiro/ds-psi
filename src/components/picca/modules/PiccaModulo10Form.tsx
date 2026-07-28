import {
  PiccaCheckboxGroup,
  PiccaEditableDataTable,
  PiccaFixedRowTable,
  PiccaObjective,
  PiccaSection,
  PiccaTextField,
} from '../PiccaFields'
import styles from '../PiccaForm.module.css'
import {
  mergePiccaModulo10Answers,
  PICCA_MOD10_FOLLOWUP_COLUMNS,
  PICCA_MOD10_INSTRUMENTS,
  type PiccaModulo10Answers,
} from './piccaModulo10'

const DEVOLUCAO = [
  { id: 'pais', label: 'Devolução aos pais/cuidadores' },
  { id: 'escola', label: 'Devolução à escola' },
  { id: 'relatorio', label: 'Relatório entregue' },
  { id: 'plano', label: 'Plano explicado' },
]

const INSTRUMENT_COLUMNS = [
  { key: 'data', label: 'Data' },
  { key: 'conclusoes', label: 'Principais conclusões' },
]

type Props = {
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  readOnly?: boolean
}

export function PiccaModulo10Form({ value, onChange, readOnly }: Props) {
  const answers = mergePiccaModulo10Answers(value)

  function set(patch: Partial<PiccaModulo10Answers>) {
    onChange({ ...answers, ...patch })
  }

  const instrumentRows = Object.fromEntries(
    PICCA_MOD10_INSTRUMENTS.map((inst) => [
      inst.id,
      {
        data: answers.instrumentosAplicados[inst.id]?.data ?? '',
        conclusoes: answers.instrumentosAplicados[inst.id]?.conclusoes ?? '',
      },
    ]),
  )

  function setInstrumentRows(next: Record<string, Record<string, string>>) {
    const instrumentosAplicados = Object.fromEntries(
      PICCA_MOD10_INSTRUMENTS.map((inst) => [
        inst.id,
        {
          data: next[inst.id]?.data ?? '',
          conclusoes: next[inst.id]?.conclusoes ?? '',
        },
      ]),
    )
    set({ instrumentosAplicados })
  }

  return (
    <div className={styles.form}>
      <PiccaObjective>
        Organizar a síntese final da avaliação psicológica, integrando a anamnese, observação clínica,
        instrumentos de avaliação, formulação de caso, conclusões diagnósticas e recomendações.
      </PiccaObjective>

      <PiccaSection title="1. Identificação do Caso">
        <PiccaTextField
          label="Identificação"
          value={answers.identificacaoCaso}
          onChange={(identificacaoCaso) => set({ identificacaoCaso })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="2. Motivo da Avaliação">
        <PiccaTextField
          label="Motivo"
          value={answers.motivoAvaliacao}
          onChange={(motivoAvaliacao) => set({ motivoAvaliacao })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="3. Instrumentos Aplicados">
        <PiccaFixedRowTable
          rows={[...PICCA_MOD10_INSTRUMENTS]}
          columns={INSTRUMENT_COLUMNS}
          value={instrumentRows}
          onChange={setInstrumentRows}
          readOnly={readOnly}
          rowHeaderLabel="Instrumento"
        />
      </PiccaSection>

      <PiccaSection title="4. Síntese dos Resultados">
        <PiccaTextField
          label="Síntese"
          value={answers.sinteseResultados}
          onChange={(sinteseResultados) => set({ sinteseResultados })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="5. Formulação Clínica Integrada">
        <PiccaTextField
          label="Formulação"
          value={answers.formulacaoClinica}
          onChange={(formulacaoClinica) => set({ formulacaoClinica })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="6. Hipóteses Diagnósticas (DSM-5-TR / CID-11)">
        <PiccaTextField
          label="Hipóteses diagnósticas"
          value={answers.hipotesesDiagnosticas}
          onChange={(hipotesesDiagnosticas) => set({ hipotesesDiagnosticas })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="7. Diagnóstico Diferencial">
        <PiccaTextField
          label="Diagnóstico diferencial"
          value={answers.diagnosticoDiferencial}
          onChange={(diagnosticoDiferencial) => set({ diagnosticoDiferencial })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="8. Recomendações">
        <PiccaTextField
          label="Recomendações"
          value={answers.recomendacoes}
          onChange={(recomendacoes) => set({ recomendacoes })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="9. Plano de Follow-up">
        <PiccaEditableDataTable
          columns={[...PICCA_MOD10_FOLLOWUP_COLUMNS]}
          rows={answers.planoFollowup}
          onChange={(planoFollowup) => set({ planoFollowup })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="10. Registo da Devolução aos Cuidadores/Escola">
        <PiccaCheckboxGroup
          options={DEVOLUCAO}
          value={answers.devolucao}
          onChange={(devolucao) => set({ devolucao })}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Observações"
          value={answers.devolucaoObservacoes}
          onChange={(devolucaoObservacoes) => set({ devolucaoObservacoes })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="11. Assinatura do Psicólogo">
        <PiccaTextField
          label="Assinatura"
          value={answers.assinaturaPsicologo}
          onChange={(assinaturaPsicologo) => set({ assinaturaPsicologo })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>
    </div>
  )
}
