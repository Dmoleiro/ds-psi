import {
  PiccaAntecedentesTable,
  PiccaCheckboxGroup,
  PiccaFamilyTable,
  PiccaFrequencyMatrix,
  PiccaObjective,
  PiccaSection,
  PiccaTextField,
} from '../PiccaFields'
import styles from '../PiccaForm.module.css'
import {
  defaultPiccaModulo2Answers,
  mergePiccaModulo2Answers,
  type PiccaModulo2Answers,
} from './piccaModulo2'

const ESTILO_ROWS = [
  { id: 'regras', label: 'Regras consistentes' },
  { id: 'limites', label: 'Limites claros' },
  { id: 'reforco', label: 'Reforço positivo' },
  { id: 'gritos', label: 'Gritos' },
  { id: 'castigos', label: 'Castigos' },
  { id: 'negociacao', label: 'Negociação' },
  { id: 'sobreprotecao', label: 'Sobreproteção' },
]

const ANTECEDENTES = [
  { id: 'phda', label: 'PHDA' },
  { id: 'pea', label: 'PEA' },
  { id: 'dislexia', label: 'Dislexia' },
  { id: 'linguagem', label: 'Perturbações da Linguagem' },
  { id: 'ansiedade', label: 'Ansiedade' },
  { id: 'depressao', label: 'Depressão' },
  { id: 'epilepsia', label: 'Epilepsia' },
  { id: 'outras', label: 'Outras' },
]

type Props = {
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  readOnly?: boolean
}

export function PiccaModulo2Form({ value, onChange, readOnly }: Props) {
  const answers = mergePiccaModulo2Answers(value)

  function set(patch: Partial<PiccaModulo2Answers>) {
    onChange({ ...answers, ...patch })
  }

  return (
    <div className={styles.form}>
      <PiccaObjective>
        Recolha sistemática de informação sobre o contexto familiar, fatores predisponentes, protetores e
        acontecimentos relevantes para a conceptualização clínica.
      </PiccaObjective>

      <PiccaSection title="1. Fontes de Informação">
        <PiccaCheckboxGroup
          options={[
            { id: 'mae', label: 'Mãe' },
            { id: 'pai', label: 'Pai' },
            { id: 'ambos', label: 'Ambos' },
            { id: 'outro_cuidador', label: 'Outro cuidador' },
            { id: 'crianca', label: 'Criança/Adolescente' },
            { id: 'escola', label: 'Escola' },
            { id: 'relatorios', label: 'Relatórios anteriores' },
            { id: 'observacao', label: 'Observação Clínica' },
            { id: 'outros', label: 'Outros' },
          ]}
          value={answers.fontesInformacao}
          onChange={(fontesInformacao) => set({ fontesInformacao })}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Outros (especificar)"
          value={answers.fontesOutros}
          onChange={(fontesOutros) => set({ fontesOutros })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="2. Composição do Agregado Familiar">
        <PiccaFamilyTable
          rows={answers.composicaoFamiliar}
          onChange={(composicaoFamiliar) => set({ composicaoFamiliar })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="3. Alterações Familiares Significativas">
        <PiccaCheckboxGroup
          options={[
            { id: 'separacao', label: 'Separação parental' },
            { id: 'divorcio', label: 'Divórcio' },
            { id: 'novo_companheiro', label: 'Novo companheiro' },
            { id: 'nascimento_irmao', label: 'Nascimento de irmão' },
            { id: 'falecimento', label: 'Falecimento' },
            { id: 'mudanca', label: 'Mudança de residência' },
            { id: 'institucionalizacao', label: 'Institucionalização' },
            { id: 'outro', label: 'Outro' },
          ]}
          value={answers.alteracoesFamiliares}
          onChange={(alteracoesFamiliares) => set({ alteracoesFamiliares })}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Outro (especificar)"
          value={answers.alteracoesOutro}
          onChange={(alteracoesOutro) => set({ alteracoesOutro })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="4. Vinculação">
        <PiccaCheckboxGroup
          label="Figura principal de vinculação"
          options={[
            { id: 'mae', label: 'Mãe' },
            { id: 'pai', label: 'Pai' },
            { id: 'ambos', label: 'Ambos' },
            { id: 'avos', label: 'Avós' },
            { id: 'outro', label: 'Outro' },
          ]}
          value={answers.vinculacaoPrincipal}
          onChange={(vinculacaoPrincipal) => set({ vinculacaoPrincipal })}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Outro (especificar)"
          value={answers.vinculacaoOutro}
          onChange={(vinculacaoOutro) => set({ vinculacaoOutro })}
          readOnly={readOnly}
        />
        <PiccaCheckboxGroup
          label="Reação à separação"
          options={[
            { id: 'tranquilo', label: 'Tranquilo' },
            { id: 'ansiedade', label: 'Alguma ansiedade' },
            { id: 'chora', label: 'Chora' },
            { id: 'recusa', label: 'Recusa separar-se' },
            { id: 'crise', label: 'Crise intensa' },
          ]}
          value={answers.reacaoSeparacao}
          onChange={(reacaoSeparacao) => set({ reacaoSeparacao })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="5. Relação Familiar">
        <PiccaTextField
          label="Relação com a mãe"
          value={answers.relacaoMae}
          onChange={(relacaoMae) => set({ relacaoMae })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Relação com o pai"
          value={answers.relacaoPai}
          onChange={(relacaoPai) => set({ relacaoPai })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Relação com irmãos"
          value={answers.relacaoIrmaos}
          onChange={(relacaoIrmaos) => set({ relacaoIrmaos })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="6. Estilo Educativo">
        <PiccaFrequencyMatrix
          rows={ESTILO_ROWS}
          value={answers.estiloEducativo as Record<string, '' | 'nunca' | 'as_vezes' | 'frequentemente'>}
          onChange={(estiloEducativo) => set({ estiloEducativo })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="7. Antecedentes Familiares">
        <PiccaAntecedentesTable
          conditions={ANTECEDENTES}
          value={answers.antecedentes}
          onChange={(antecedentes) => set({ antecedentes })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="8. Acontecimentos de Vida Significativos">
        <PiccaTextField
          label="Descreva acontecimentos relevantes, idade de ocorrência e impacto percebido"
          value={answers.acontecimentosVida}
          onChange={(acontecimentosVida) => set({ acontecimentosVida })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="9. Integração Clínica (Preenchimento pelo Psicólogo)">
        <PiccaTextField
          label="Fatores Predisponentes"
          value={answers.integracaoPredisponentes}
          onChange={(integracaoPredisponentes) => set({ integracaoPredisponentes })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Fatores Protetores"
          value={answers.integracaoProtetores}
          onChange={(integracaoProtetores) => set({ integracaoProtetores })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Vulnerabilidades"
          value={answers.integracaoVulnerabilidades}
          onChange={(integracaoVulnerabilidades) => set({ integracaoVulnerabilidades })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Recursos Familiares"
          value={answers.integracaoRecursos}
          onChange={(integracaoRecursos) => set({ integracaoRecursos })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Hipóteses Clínicas Iniciais"
          value={answers.integracaoHipoteses}
          onChange={(integracaoHipoteses) => set({ integracaoHipoteses })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Questões a Explorar"
          value={answers.integracaoQuestoes}
          onChange={(integracaoQuestoes) => set({ integracaoQuestoes })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>
    </div>
  )
}

export { defaultPiccaModulo2Answers }
