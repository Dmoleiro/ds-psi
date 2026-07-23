import { FichaInscricaoForm } from './FichaInscricaoForm'
import { QueixaInicialForm } from './QueixaInicialForm'
import { AnexarDocumentosForm } from './AnexarDocumentosForm'
import { patientFormRenderers } from './formRegistry'

patientFormRenderers['ficha-inscricao'] = (props) => <FichaInscricaoForm {...props} />
patientFormRenderers['queixa-inicial'] = (props) => <QueixaInicialForm {...props} />
patientFormRenderers['anexar-documentos'] = (props) => <AnexarDocumentosForm {...props} />
