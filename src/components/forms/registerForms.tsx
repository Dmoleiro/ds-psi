import { FichaInscricaoForm } from './FichaInscricaoForm'
import { QueixaInicialForm, normalizeQueixaInicialValues } from './QueixaInicialForm'
import { AnexarDocumentosForm } from './AnexarDocumentosForm'
import { patientFormRenderers, patientFormValueNormalizers } from './formRegistry'

patientFormRenderers['ficha-inscricao'] = (props) => <FichaInscricaoForm {...props} />
patientFormRenderers['queixa-inicial'] = (props) => <QueixaInicialForm {...props} />
patientFormRenderers['anexar-documentos'] = (props) => <AnexarDocumentosForm {...props} />
patientFormValueNormalizers['queixa-inicial'] = normalizeQueixaInicialValues
