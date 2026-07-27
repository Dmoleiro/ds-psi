import {
  PiccaAlertTable,
  PiccaCheckboxGroup,
  PiccaObjective,
  PiccaSection,
  PiccaTextField,
} from '../PiccaFields'
import styles from '../PiccaForm.module.css'
import { mergePiccaModulo4Answers, type PiccaModulo4Answers } from './piccaModulo4'

const ALERTAS = [
  { id: 'atraso_motor', label: 'Atraso motor' },
  { id: 'atraso_linguagem', label: 'Atraso da linguagem' },
  { id: 'jogo_simbolico', label: 'Ausência de jogo simbólico' },
  { id: 'contacto_ocular', label: 'Défice de contacto ocular' },
  { id: 'rigidez', label: 'Rigidez comportamental' },
  { id: 'autorregulacao', label: 'Dificuldades de autorregulação' },
  { id: 'coordenacao', label: 'Coordenação motora fraca' },
  { id: 'atraso_adaptativo', label: 'Atraso adaptativo' },
]

type Props = {
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  readOnly?: boolean
}

export function PiccaModulo4Form({ value, onChange, readOnly }: Props) {
  const answers = mergePiccaModulo4Answers(value)

  function set(patch: Partial<PiccaModulo4Answers>) {
    onChange({ ...answers, ...patch })
  }

  return (
    <div className={styles.form}>
      <PiccaObjective>
        Marcos do desenvolvimento, competências, sinais de alerta e áreas de vulnerabilidade para a
        formulação de caso.
      </PiccaObjective>

      <PiccaSection title="1. Desenvolvimento Motor Grosso">
        <div className={styles.inlineFields}>
          <PiccaTextField
            label="Idade em que se sentou sem apoio"
            value={answers.sentouSemApoio}
            onChange={(sentouSemApoio) => set({ sentouSemApoio })}
            readOnly={readOnly}
          />
          <PiccaTextField
            label="Idade em que gatinhou"
            value={answers.gatinhou}
            onChange={(gatinhou) => set({ gatinhou })}
            readOnly={readOnly}
          />
          <PiccaTextField
            label="Idade dos primeiros passos"
            value={answers.primeirosPassos}
            onChange={(primeirosPassos) => set({ primeirosPassos })}
            readOnly={readOnly}
          />
          <PiccaTextField
            label="Subia escadas"
            value={answers.subiaEscadas}
            onChange={(subiaEscadas) => set({ subiaEscadas })}
            readOnly={readOnly}
          />
        </div>
        <PiccaTextField
          label="Observações"
          value={answers.motorGrossoObs}
          onChange={(motorGrossoObs) => set({ motorGrossoObs })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="2. Desenvolvimento Motor Fino">
        <PiccaTextField
          label="Preensão adequada (Sim/Não)"
          value={answers.preensaoAdequada}
          onChange={(preensaoAdequada) => set({ preensaoAdequada })}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Manipulação de objetos"
          value={answers.manipulacaoObjetos}
          onChange={(manipulacaoObjetos) => set({ manipulacaoObjetos })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Grafomotricidade"
          value={answers.grafomotricidade}
          onChange={(grafomotricidade) => set({ grafomotricidade })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="3. Desenvolvimento da Linguagem">
        <div className={styles.inlineFields}>
          <PiccaTextField
            label="Primeiras palavras"
            value={answers.primeirasPalavras}
            onChange={(primeirasPalavras) => set({ primeirasPalavras })}
            readOnly={readOnly}
          />
          <PiccaTextField
            label="Primeiras frases"
            value={answers.primeirasFrases}
            onChange={(primeirasFrases) => set({ primeirasFrases })}
            readOnly={readOnly}
          />
        </div>
        <PiccaTextField
          label="Compreensão (Adequada/Atrasada)"
          value={answers.compreensao}
          onChange={(compreensao) => set({ compreensao })}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Expressão (Adequada/Atrasada)"
          value={answers.expressao}
          onChange={(expressao) => set({ expressao })}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Pragmática"
          value={answers.pragmatica}
          onChange={(pragmatica) => set({ pragmatica })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="4. Comunicação Social">
        <PiccaCheckboxGroup
          options={[
            { id: 'contacto_ocular', label: 'Contacto ocular adequado' },
            { id: 'aponta', label: 'Aponta para partilhar interesses' },
            { id: 'responde_nome', label: 'Responde ao nome' },
            { id: 'inicia_interacao', label: 'Inicia interação' },
            { id: 'mantem_conversa', label: 'Mantém conversação' },
          ]}
          value={answers.comunicacaoSocial}
          onChange={(comunicacaoSocial) => set({ comunicacaoSocial })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="5. Brincadeira">
        <PiccaCheckboxGroup
          options={[
            { id: 'exploratoria', label: 'Exploratória' },
            { id: 'funcional', label: 'Funcional' },
            { id: 'simbolica', label: 'Simbólica' },
            { id: 'regras', label: 'Regras' },
          ]}
          value={answers.brincadeira}
          onChange={(brincadeira) => set({ brincadeira })}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Brincadeiras preferidas"
          value={answers.brincadeirasPreferidas}
          onChange={(brincadeirasPreferidas) => set({ brincadeirasPreferidas })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="6. Desenvolvimento Emocional">
        <PiccaTextField
          label="Reconhece emoções (Sim/Não)"
          value={answers.reconheceEmocoes}
          onChange={(reconheceEmocoes) => set({ reconheceEmocoes })}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Expressa emoções"
          value={answers.expressaEmocoes}
          onChange={(expressaEmocoes) => set({ expressaEmocoes })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Regulação emocional"
          value={answers.regulacaoEmocional}
          onChange={(regulacaoEmocional) => set({ regulacaoEmocional })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="7. Autonomia">
        <PiccaTextField label="Vestir-se" value={answers.vestir} onChange={(vestir) => set({ vestir })} readOnly={readOnly} />
        <PiccaTextField
          label="Alimentação"
          value={answers.alimentacaoAutonomia}
          onChange={(alimentacaoAutonomia) => set({ alimentacaoAutonomia })}
          readOnly={readOnly}
        />
        <PiccaTextField label="Higiene" value={answers.higiene} onChange={(higiene) => set({ higiene })} readOnly={readOnly} />
        <PiccaTextField
          label="Controlo de esfíncteres"
          value={answers.controloEsfinteres}
          onChange={(controloEsfinteres) => set({ controloEsfinteres })}
          readOnly={readOnly}
        />
      </PiccaSection>

      <PiccaSection title="8. Perfil Sensorial">
        <PiccaCheckboxGroup
          options={[
            { id: 'hipersens_auditiva', label: 'Hipersensibilidade auditiva' },
            { id: 'hipossens', label: 'Hipossensibilidade' },
            { id: 'seletividade', label: 'Seletividade alimentar' },
            { id: 'procura', label: 'Procura sensorial' },
          ]}
          value={answers.perfilSensorial}
          onChange={(perfilSensorial) => set({ perfilSensorial })}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Observações"
          value={answers.perfilSensorialObs}
          onChange={(perfilSensorialObs) => set({ perfilSensorialObs })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="Indicadores Clínicos de Alerta">
        <PiccaAlertTable
          rows={ALERTAS}
          value={answers.alertas}
          onChange={(alertas) => set({ alertas })}
          readOnly={readOnly}
          withSeverity
        />
      </PiccaSection>

      <PiccaSection title="Integração Clínica">
        <PiccaTextField
          label="Áreas fortes"
          value={answers.integracaoFortes}
          onChange={(integracaoFortes) => set({ integracaoFortes })}
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
          label="Fatores predisponentes"
          value={answers.integracaoPredisponentes}
          onChange={(integracaoPredisponentes) => set({ integracaoPredisponentes })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Hipóteses clínicas"
          value={answers.integracaoHipoteses}
          onChange={(integracaoHipoteses) => set({ integracaoHipoteses })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Avaliações complementares sugeridas"
          value={answers.integracaoAvaliacoes}
          onChange={(integracaoAvaliacoes) => set({ integracaoAvaliacoes })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>
    </div>
  )
}
