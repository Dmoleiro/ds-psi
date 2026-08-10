import {
  PiccaAlertTable,
  PiccaCheckboxGroup,
  PiccaObjective,
  PiccaRadioGroup,
  PiccaSection,
  PiccaTextField,
} from '../PiccaFields'
import styles from '../PiccaForm.module.css'
import { mergePiccaModulo3Answers, type PiccaModulo3Answers } from './piccaModulo3'

const ALERTAS = [
  { id: 'prematuridade', label: 'Prematuridade (<37 semanas)' },
  { id: 'baixo_peso', label: 'Baixo peso ao nascer' },
  { id: 'hipoxia', label: 'Hipóxia/sofrimento fetal' },
  { id: 'internamento', label: 'Internamento neonatal' },
  { id: 'substancias', label: 'Exposição pré-natal a substâncias' },
  { id: 'obstetricas', label: 'Complicações obstétricas' },
]

type Props = {
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  readOnly?: boolean
}

export function PiccaModulo3Form({ value, onChange, readOnly }: Props) {
  const answers = mergePiccaModulo3Answers(value)

  function set(patch: Partial<PiccaModulo3Answers>) {
    onChange({ ...answers, ...patch })
  }

  return (
    <div className={styles.form}>
      <PiccaObjective>
        Recolher informação sobre fatores pré-natais, peri-natais e neonatais relevantes para a
        conceptualização clínica, identificando fatores predisponentes e fatores de risco do
        neurodesenvolvimento.
      </PiccaObjective>

      <PiccaSection title="1. Planeamento da Gravidez">
        <PiccaCheckboxGroup
          options={[
            { id: 'planeada', label: 'Gravidez planeada' },
            { id: 'nao_planeada', label: 'Não planeada' },
            { id: 'fertilidade', label: 'Fertilidade medicamente assistida' },
            { id: 'risco', label: 'Gravidez de risco' },
            { id: 'sem_intercorrencias_final', label: 'Gravidez sem intercorrências até ao final da gestação' },
          ]}
          value={answers.gravidezPlaneada}
          onChange={(gravidezPlaneada) => set({ gravidezPlaneada })}
          readOnly={readOnly}
        />
        <div className={styles.inlineFields}>
          <PiccaTextField
            label="Idade materna"
            value={answers.idadeMaterna}
            onChange={(idadeMaterna) => set({ idadeMaterna })}
            readOnly={readOnly}
          />
          <PiccaTextField
            label="Idade paterna"
            value={answers.idadePaterna}
            onChange={(idadePaterna) => set({ idadePaterna })}
            readOnly={readOnly}
          />
        </div>
        <PiccaTextField
          label="Observações"
          value={answers.planeamentoObs}
          onChange={(planeamentoObs) => set({ planeamentoObs })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="2. Gravidez">
        <PiccaCheckboxGroup
          options={[
            { id: 'sem_intercorrencias', label: 'Sem intercorrências' },
            { id: 'diabetes', label: 'Diabetes gestacional' },
            { id: 'hipertensao', label: 'Hipertensão' },
            { id: 'preeclampsia', label: 'Pré-eclâmpsia' },
            { id: 'infecoes', label: 'Infeções' },
            { id: 'hemorragias', label: 'Hemorragias' },
            { id: 'hospitalizacoes', label: 'Hospitalizações' },
            { id: 'alcool_tabaco_drogas', label: 'Consumo de álcool/tabaco/drogas' },
            { id: 'enjoos_vomitos', label: 'Enjoos e vómitos' },
            { id: 'stress', label: 'Stress significativo' },
            { id: 'ansiedade', label: 'Ansiedade' },
            { id: 'depressao', label: 'Depressão' },
          ]}
          value={answers.gravidezIntercorrencias}
          onChange={(gravidezIntercorrencias) => set({ gravidezIntercorrencias })}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Medicação durante a gravidez"
          value={answers.gravidezMedicacao}
          onChange={(gravidezMedicacao) => set({ gravidezMedicacao })}
          readOnly={readOnly}
        />
        <PiccaCheckboxGroup
          label="Durante a gravidez a criança era"
          options={[
            { id: 'agitada', label: 'Agitada' },
            { id: 'muito_mexida', label: 'Muito mexida' },
            { id: 'muito_calma', label: 'Demasiado calma e sem se mexer muito' },
            { id: 'ativa_noite', label: 'Mais ativa à noite' },
            { id: 'ativa_dia', label: 'Mais ativa durante o dia' },
          ]}
          value={answers.gravidezCrianca}
          onChange={(gravidezCrianca) => set({ gravidezCrianca })}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Observações"
          value={answers.gravidezObs}
          onChange={(gravidezObs) => set({ gravidezObs })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="3. Parto">
        <PiccaTextField
          label="Semanas de gestação"
          value={answers.semanasGestacao}
          onChange={(semanasGestacao) => set({ semanasGestacao })}
          readOnly={readOnly}
        />
        <PiccaCheckboxGroup
          label="Tipo de parto"
          options={[
            { id: 'eutocico', label: 'Eutócico' },
            { id: 'cesariana', label: 'Cesariana' },
            { id: 'ventosa', label: 'Ventosa' },
            { id: 'forceps', label: 'Fórceps' },
          ]}
          value={answers.tipoParto}
          onChange={(tipoParto) => set({ tipoParto })}
          readOnly={readOnly}
        />
        <div className={styles.inlineFields}>
          <PiccaTextField label="Peso" value={answers.peso} onChange={(peso) => set({ peso })} readOnly={readOnly} />
          <PiccaTextField
            label="Comprimento"
            value={answers.comprimento}
            onChange={(comprimento) => set({ comprimento })}
            readOnly={readOnly}
          />
          <PiccaTextField label="APGAR 1'" value={answers.apgar1} onChange={(apgar1) => set({ apgar1 })} readOnly={readOnly} />
          <PiccaTextField label="APGAR 5'" value={answers.apgar5} onChange={(apgar5) => set({ apgar5 })} readOnly={readOnly} />
          <PiccaTextField label="APGAR 10'" value={answers.apgar10} onChange={(apgar10) => set({ apgar10 })} readOnly={readOnly} />
        </div>
        <PiccaTextField
          label="Complicações"
          value={answers.partoComplicacoes}
          onChange={(partoComplicacoes) => set({ partoComplicacoes })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="4. Período Neonatal">
        <PiccaCheckboxGroup
          options={[
            { id: 'alta_mae', label: 'Alta com a mãe' },
            { id: 'neonatologia', label: 'Internamento em Neonatologia' },
            { id: 'ictericia', label: 'Icterícia' },
            { id: 'convulsoes', label: 'Convulsões' },
            { id: 'respiratorias', label: 'Dificuldades respiratórias' },
            { id: 'alimentacao_materna', label: 'Alimentação materna' },
          ]}
          value={answers.neonatal}
          onChange={(neonatal) => set({ neonatal })}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Observações"
          value={answers.neonatalObs}
          onChange={(neonatalObs) => set({ neonatalObs })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="5. Primeiros Meses de Vida">
        <PiccaTextField label="Sono" value={answers.sono} onChange={(sono) => set({ sono })} readOnly={readOnly} multiline />
        <PiccaCheckboxGroup
          label="Padrão de sono"
          options={[
            { id: 'regular', label: 'Regular' },
            { id: 'interrupcoes', label: 'Com interrupções' },
          ]}
          value={answers.sonoRegular}
          onChange={(sonoRegular) => set({ sonoRegular })}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Horas de sono noturnas"
          value={answers.sonoHorasNoturnas}
          onChange={(sonoHorasNoturnas) => set({ sonoHorasNoturnas })}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Dormiu no berço no quarto dos pais até (meses)"
          value={answers.berçoQuartosPaisMeses}
          onChange={(berçoQuartosPaisMeses) => set({ berçoQuartosPaisMeses })}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Quarto próprio aos (meses/anos)"
          value={answers.quartoProprioIdade}
          onChange={(quartoProprioIdade) => set({ quartoProprioIdade })}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Alimentação"
          value={answers.alimentacao}
          onChange={(alimentacao) => set({ alimentacao })}
          readOnly={readOnly}
          multiline
        />
        <PiccaCheckboxGroup
          label="Tipo de alimentação"
          options={[
            { id: 'materna', label: 'Alimentação exclusivamente materna' },
            { id: 'formula', label: 'Alimentação com leite de fórmula' },
            { id: 'ambas', label: 'Ambas' },
          ]}
          value={answers.alimentacaoTipo}
          onChange={(alimentacaoTipo) => set({ alimentacaoTipo })}
          readOnly={readOnly}
        />
        <PiccaCheckboxGroup
          label="Temperamento"
          options={[
            { id: 'calmo', label: 'Calmo' },
            { id: 'irritavel', label: 'Irritável' },
            { id: 'ativo', label: 'Muito ativo' },
            { id: 'dificil', label: 'Difícil de consolar' },
          ]}
          value={answers.temperamento}
          onChange={(temperamento) => set({ temperamento })}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Vinculação precoce"
          value={answers.vinculacaoPrecoce}
          onChange={(vinculacaoPrecoce) => set({ vinculacaoPrecoce })}
          readOnly={readOnly}
          multiline
        />
        <PiccaCheckboxGroup
          label="Vinculação com"
          options={[
            { id: 'mae', label: 'Mãe exclusivamente' },
            { id: 'pai', label: 'Pai exclusivamente' },
            { id: 'ambos', label: 'Ambos' },
            { id: 'outro', label: 'Outro cuidador/familiar' },
          ]}
          value={answers.vinculacaoTipo}
          onChange={(vinculacaoTipo) => set({ vinculacaoTipo })}
          readOnly={readOnly}
        />
        {answers.vinculacaoTipo.includes('outro') && (
          <PiccaTextField
            label="Outro cuidador/familiar — quem?"
            value={answers.vinculacaoOutroCuidador}
            onChange={(vinculacaoOutroCuidador) => set({ vinculacaoOutroCuidador })}
            readOnly={readOnly}
          />
        )}
        <PiccaRadioGroup
          label="Foram percecionadas alterações auditivas?"
          options={[
            { id: 'sim', label: 'Sim' },
            { id: 'nao', label: 'Não' },
          ]}
          value={answers.alteracoesAuditivas}
          onChange={(alteracoesAuditivas) =>
            set({ alteracoesAuditivas: alteracoesAuditivas as PiccaModulo3Answers['alteracoesAuditivas'] })
          }
          readOnly={readOnly}
        />
        <PiccaRadioGroup
          label="Convulsões febris?"
          options={[
            { id: 'sim', label: 'Sim' },
            { id: 'nao', label: 'Não' },
          ]}
          value={answers.convulsoesFebris}
          onChange={(convulsoesFebris) =>
            set({ convulsoesFebris: convulsoesFebris as PiccaModulo3Answers['convulsoesFebris'] })
          }
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="Indicadores Clínicos de Alerta">
        <PiccaAlertTable
          rows={ALERTAS}
          value={answers.alertas}
          onChange={(alertas) => set({ alertas })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="Integração Clínica">
        <PiccaTextField
          label="Fatores predisponentes identificados"
          value={answers.integracaoPredisponentes}
          onChange={(integracaoPredisponentes) => set({ integracaoPredisponentes })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Fatores protetores"
          value={answers.integracaoProtetores}
          onChange={(integracaoProtetores) => set({ integracaoProtetores })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Questões a explorar"
          value={answers.integracaoQuestoes}
          onChange={(integracaoQuestoes) => set({ integracaoQuestoes })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Hipóteses clínicas iniciais"
          value={answers.integracaoHipoteses}
          onChange={(integracaoHipoteses) => set({ integracaoHipoteses })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>
    </div>
  )
}
