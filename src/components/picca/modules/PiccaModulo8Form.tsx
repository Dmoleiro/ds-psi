import {
  PiccaInstrumentTable,
  PiccaObjective,
  PiccaReadOnlyText,
  PiccaSection,
  PiccaTextField,
} from '../PiccaFields'
import styles from '../PiccaForm.module.css'
import {
  mergePiccaModulo8Answers,
  PICCA_MOD8_INSTRUMENTS,
  type PiccaModulo8Answers,
} from './piccaModulo8'

type Props = {
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  readOnly?: boolean
}

function ObjectiveList({
  title,
  items,
  onChange,
  readOnly,
}: {
  title: string
  items: string[]
  onChange: (next: string[]) => void
  readOnly?: boolean
}) {
  return (
    <div className={styles.field}>
      <span>{title}</span>
      {items.map((item, index) => (
        <PiccaTextField
          key={index}
          label={`${index + 1}.`}
          value={item}
          onChange={(val) => onChange(items.map((v, i) => (i === index ? val : v)))}
          readOnly={readOnly}
        />
      ))}
    </div>
  )
}

export function PiccaModulo8Form({ value, onChange, readOnly }: Props) {
  const answers = mergePiccaModulo8Answers(value)

  function set(patch: Partial<PiccaModulo8Answers>) {
    onChange({ ...answers, ...patch })
  }

  return (
    <div className={styles.form}>
      <PiccaObjective>
        Integrar a informação recolhida na anamnese, observação clínica e avaliação psicológica,
        formular hipóteses clínicas fundamentadas e definir prioridades de intervenção.
      </PiccaObjective>

      <PiccaSection title="1. Motivo Principal da Avaliação">
        <PiccaTextField
          label="Motivo principal"
          value={answers.motivoPrincipal}
          onChange={(motivoPrincipal) => set({ motivoPrincipal })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="2. Síntese da Informação Recolhida">
        <PiccaTextField
          label="Síntese"
          value={answers.sinteseInformacao}
          onChange={(sinteseInformacao) => set({ sinteseInformacao })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="3. Integração dos Instrumentos de Avaliação">
        <PiccaInstrumentTable
          instruments={[...PICCA_MOD8_INSTRUMENTS]}
          value={answers.instrumentos}
          onChange={(instrumentos) => set({ instrumentos })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="4. Formulação Clínica (Modelo dos 5 P's)">
        <PiccaTextField
          label="Problema Principal"
          value={answers.cincoPsProblema}
          onChange={(cincoPsProblema) => set({ cincoPsProblema })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Fatores Predisponentes"
          value={answers.cincoPsPredisponentes}
          onChange={(cincoPsPredisponentes) => set({ cincoPsPredisponentes })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Fatores Precipitantes"
          value={answers.cincoPsPrecipitantes}
          onChange={(cincoPsPrecipitantes) => set({ cincoPsPrecipitantes })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Fatores Perpetuantes"
          value={answers.cincoPsPerpetuantes}
          onChange={(cincoPsPerpetuantes) => set({ cincoPsPerpetuantes })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Fatores Protetores"
          value={answers.cincoPsProtetores}
          onChange={(cincoPsProtetores) => set({ cincoPsProtetores })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="5. Formulação Cognitivo-Comportamental">
        <PiccaReadOnlyText>
          {`Situação desencadeante
↓
Pensamentos automáticos
↓
Emoções
↓
Respostas fisiológicas
↓
Comportamentos
↓
Consequências
↓
Manutenção do problema`}
        </PiccaReadOnlyText>
        <PiccaTextField
          label="Situação desencadeante"
          value={answers.cbtSituacaoDesencadeante}
          onChange={(cbtSituacaoDesencadeante) => set({ cbtSituacaoDesencadeante })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Pensamentos automáticos"
          value={answers.cbtPensamentosAutomaticos}
          onChange={(cbtPensamentosAutomaticos) => set({ cbtPensamentosAutomaticos })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Emoções"
          value={answers.cbtEmocoes}
          onChange={(cbtEmocoes) => set({ cbtEmocoes })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Respostas fisiológicas"
          value={answers.cbtRespostasFisiologicas}
          onChange={(cbtRespostasFisiologicas) => set({ cbtRespostasFisiologicas })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Comportamentos"
          value={answers.cbtComportamentos}
          onChange={(cbtComportamentos) => set({ cbtComportamentos })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Consequências"
          value={answers.cbtConsequencias}
          onChange={(cbtConsequencias) => set({ cbtConsequencias })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Manutenção do problema"
          value={answers.cbtManutencao}
          onChange={(cbtManutencao) => set({ cbtManutencao })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="6. Áreas Fortes">
        <PiccaTextField
          label="Áreas fortes"
          value={answers.areasFortes}
          onChange={(areasFortes) => set({ areasFortes })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="7. Vulnerabilidades">
        <PiccaTextField
          label="Vulnerabilidades"
          value={answers.vulnerabilidades}
          onChange={(vulnerabilidades) => set({ vulnerabilidades })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="8. Hipóteses Clínicas">
        <PiccaTextField
          label="Hipóteses clínicas"
          value={answers.hipotesesClinicas}
          onChange={(hipotesesClinicas) => set({ hipotesesClinicas })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="9. Impacto Funcional">
        <PiccaTextField
          label="Impacto funcional"
          value={answers.impactoFuncional}
          onChange={(impactoFuncional) => set({ impactoFuncional })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="10. Objetivos Prioritários da Intervenção">
        <ObjectiveList
          title="Curto prazo"
          items={answers.objetivosCurtoPrazo}
          onChange={(objetivosCurtoPrazo) => set({ objetivosCurtoPrazo })}
          readOnly={readOnly}
        />
        <ObjectiveList
          title="Médio prazo"
          items={answers.objetivosMedioPrazo}
          onChange={(objetivosMedioPrazo) => set({ objetivosMedioPrazo })}
          readOnly={readOnly}
        />
        <ObjectiveList
          title="Longo prazo"
          items={answers.objetivosLongoPrazo}
          onChange={(objetivosLongoPrazo) => set({ objetivosLongoPrazo })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="11. Recomendações Iniciais">
        <PiccaTextField
          label="Recomendações"
          value={answers.recomendacoesIniciais}
          onChange={(recomendacoesIniciais) => set({ recomendacoesIniciais })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="12. Impressão Clínica Global">
        <PiccaTextField
          label="Impressão clínica global"
          value={answers.impressaoClinicaGlobal}
          onChange={(impressaoClinicaGlobal) => set({ impressaoClinicaGlobal })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>
    </div>
  )
}
