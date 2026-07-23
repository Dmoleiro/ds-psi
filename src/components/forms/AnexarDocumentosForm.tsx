import type { PatientFormRendererProps } from './formRegistry'
import { PatientDocumentAttachments } from '../patient/PatientDocumentAttachments'

export function AnexarDocumentosForm({
  patientToken,
  readOnly,
}: PatientFormRendererProps) {
  if (!patientToken) return null

  return (
    <PatientDocumentAttachments
      token={patientToken}
      readOnly={readOnly}
      title="Anexar documentos"
      description="Se tiver documentos para anexar (por exemplo, relatórios escolares, exames ou fotografias), carregue-os aqui em formato PDF ou imagem. Pode voltar a esta página quando quiser para adicionar mais ficheiros."
    />
  )
}
