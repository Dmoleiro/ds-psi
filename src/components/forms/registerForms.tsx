import { FichaInscricaoForm } from './FichaInscricaoForm'
import { QueixaInicialForm } from './QueixaInicialForm'
import { patientFormRenderers } from './formRegistry'

patientFormRenderers['ficha-inscricao'] = (props) => <FichaInscricaoForm {...props} />
patientFormRenderers['queixa-inicial'] = (props) => <QueixaInicialForm {...props} />
