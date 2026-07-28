import {
  PiccaCaregiverFields,
  PiccaCheckboxGroup,
  PiccaObjective,
  PiccaReadOnlyText,
  PiccaSection,
  PiccaTextField,
} from '../PiccaFields'
import styles from '../PiccaForm.module.css'
import { mergePiccaModulo1Answers, type PiccaModulo1Answers } from './piccaModulo1'

const ENCAMINHADO = [
  { id: 'pais', label: 'Pais' },
  { id: 'escola', label: 'Escola' },
  { id: 'pediatra', label: 'Pediatra' },
  { id: 'neuropediatra', label: 'Neuropediatra' },
  { id: 'psicologo', label: 'Psicólogo' },
  { id: 'medico_familia', label: 'Médico de Família' },
  { id: 'outro', label: 'Outro' },
]

const OBJETIVOS = [
  { id: 'desenvolvimento', label: 'Desenvolvimento' },
  { id: 'aprendizagem', label: 'Aprendizagem' },
  { id: 'phda', label: 'PHDA' },
  { id: 'pea', label: 'PEA' },
  { id: 'linguagem', label: 'Linguagem' },
  { id: 'emocoes', label: 'Emoções' },
  { id: 'comportamento', label: 'Comportamento' },
  { id: 'outro', label: 'Outro' },
]

type Props = {
  value: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  readOnly?: boolean
}

export function PiccaModulo1Form({ value, onChange, readOnly }: Props) {
  const answers = mergePiccaModulo1Answers(value)

  function set(patch: Partial<PiccaModulo1Answers>) {
    onChange({ ...answers, ...patch })
  }

  return (
    <div className={styles.form}>
      <PiccaObjective>
        Recolha de dados de identificação, referenciação e síntese clínica inicial para orientar a
        avaliação.
      </PiccaObjective>

      <PiccaSection title="1. Dados da Criança">
        <div className={styles.inlineFields}>
          <PiccaTextField
            label="Nome completo"
            value={answers.nomeCompleto}
            onChange={(nomeCompleto) => set({ nomeCompleto })}
            readOnly={readOnly}
          />
          <PiccaTextField
            label="Data de nascimento"
            value={answers.dataNascimento}
            onChange={(dataNascimento) => set({ dataNascimento })}
            readOnly={readOnly}
          />
          <PiccaTextField
            label="Idade"
            value={answers.idade}
            onChange={(idade) => set({ idade })}
            readOnly={readOnly}
          />
          <PiccaTextField
            label="Sexo"
            value={answers.sexo}
            onChange={(sexo) => set({ sexo })}
            readOnly={readOnly}
          />
          <PiccaTextField
            label="Ano de escolaridade"
            value={answers.anoEscolaridade}
            onChange={(anoEscolaridade) => set({ anoEscolaridade })}
            readOnly={readOnly}
          />
          <PiccaTextField
            label="Escola"
            value={answers.escola}
            onChange={(escola) => set({ escola })}
            readOnly={readOnly}
          />
          <PiccaTextField
            label="Turma"
            value={answers.turma}
            onChange={(turma) => set({ turma })}
            readOnly={readOnly}
          />
          <PiccaTextField
            label="Professor(a)/DT"
            value={answers.professor}
            onChange={(professor) => set({ professor })}
            readOnly={readOnly}
          />
          <PiccaTextField
            label="Morada"
            value={answers.morada}
            onChange={(morada) => set({ morada })}
            readOnly={readOnly}
          />
          <PiccaTextField
            label="Contacto"
            value={answers.contacto}
            onChange={(contacto) => set({ contacto })}
            readOnly={readOnly}
          />
          <PiccaTextField
            label="NIF"
            value={answers.nif}
            onChange={(nif) => set({ nif })}
            readOnly={readOnly}
          />
          <PiccaTextField
            label="N.º SNS"
            value={answers.sns}
            onChange={(sns) => set({ sns })}
            readOnly={readOnly}
          />
        </div>
      </PiccaSection>

      <PiccaSection title="2. Pais/Cuidadores">
        <PiccaCaregiverFields
          title="Mãe"
          value={answers.mae}
          onChange={(mae) => set({ mae })}
          readOnly={readOnly}
        />
        <PiccaCaregiverFields
          title="Pai"
          value={answers.pai}
          onChange={(pai) => set({ pai })}
          readOnly={readOnly}
        />
        <PiccaTextField
          label="Outros cuidadores"
          value={answers.outrosCuidadores}
          onChange={(outrosCuidadores) => set({ outrosCuidadores })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="3. Motivo da Referenciação">
        <PiccaCheckboxGroup
          label="Quem encaminhou?"
          options={ENCAMINHADO}
          value={answers.encaminhado}
          onChange={(encaminhado) => set({ encaminhado })}
          readOnly={readOnly}
        />
        {answers.encaminhado.includes('outro') && (
          <PiccaTextField
            label="Outro (especificar)"
            value={answers.encaminhadoOutro}
            onChange={(encaminhadoOutro) => set({ encaminhadoOutro })}
            readOnly={readOnly}
          />
        )}
        <PiccaTextField
          label="Motivo principal"
          value={answers.motivoPrincipal}
          onChange={(motivoPrincipal) => set({ motivoPrincipal })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="4. Objetivos da Avaliação">
        <PiccaCheckboxGroup
          options={OBJETIVOS}
          value={answers.objetivos}
          onChange={(objetivos) => set({ objetivos })}
          readOnly={readOnly}
        />
        {answers.objetivos.includes('outro') && (
          <PiccaTextField
            label="Outro objetivo"
            value={answers.objetivosOutro}
            onChange={(objetivosOutro) => set({ objetivosOutro })}
            readOnly={readOnly}
          />
        )}
      </PiccaSection>

      <PiccaSection title="Síntese Clínica Inicial">
        <PiccaTextField
          label="Principais preocupações"
          value={answers.sintesePreocupacoes}
          onChange={(sintesePreocupacoes) => set({ sintesePreocupacoes })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Fatores predisponentes identificados"
          value={answers.sintesePredisponentes}
          onChange={(sintesePredisponentes) => set({ sintesePredisponentes })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Fatores protetores"
          value={answers.sinteseProtetores}
          onChange={(sinteseProtetores) => set({ sinteseProtetores })}
          readOnly={readOnly}
          multiline
        />
        <PiccaTextField
          label="Hipóteses clínicas iniciais"
          value={answers.sinteseHipoteses}
          onChange={(sinteseHipoteses) => set({ sinteseHipoteses })}
          readOnly={readOnly}
          multiline
        />
      </PiccaSection>

      <PiccaSection title="Plano do Volume I">
        <PiccaReadOnlyText>
          {`Este documento será desenvolvido em módulos:
1. Identificação e referenciação
2. História familiar
3. Gravidez, parto e período neonatal
4. História do desenvolvimento
5. Funcionamento atual
6. Percurso escolar
7. Observação clínica
8. Síntese clínica inicial

Cada módulo integrará notas clínicas, indicadores de alerta, fatores dos 5 P's e espaço para formulação de caso.`}
        </PiccaReadOnlyText>
      </PiccaSection>
    </div>
  )
}
