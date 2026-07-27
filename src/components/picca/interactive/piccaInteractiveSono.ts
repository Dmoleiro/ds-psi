export type PiccaInteractiveSonoAnswers = {
  horaInicio: string
  passo1: string
  passo2: string
  passo3: string
  horaFim: string
  dificuldades: string
  melhorias: string
}

export const defaultPiccaInteractiveSonoAnswers = (): PiccaInteractiveSonoAnswers => ({
  horaInicio: '',
  passo1: '',
  passo2: '',
  passo3: '',
  horaFim: '',
  dificuldades: '',
  melhorias: '',
})
