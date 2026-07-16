import { FichaInscricaoForm } from './FichaInscricaoForm'
import { patientFormRenderers } from './formRegistry'

patientFormRenderers['ficha-inscricao'] = (props) => <FichaInscricaoForm {...props} />
