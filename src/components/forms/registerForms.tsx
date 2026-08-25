import { FichaInscricaoForm } from './FichaInscricaoForm'
import { QueixaInicialForm, normalizeQueixaInicialValues } from './QueixaInicialForm'
import { AnexarDocumentosForm } from './AnexarDocumentosForm'
import { InventarioAspergerForm } from './InventarioAspergerForm'
import { AdirForm } from './AdirForm'
import { VinelandForm } from './VinelandForm'
import { QuestionnaireForm } from './QuestionnaireForm'
import { QUESTIONNAIRE_IDS } from '../../lib/questionnaires'
import { patientFormRenderers, patientFormValueNormalizers } from './formRegistry'

patientFormRenderers['ficha-inscricao'] = (props) => <FichaInscricaoForm {...props} />
patientFormRenderers['queixa-inicial'] = (props) => <QueixaInicialForm {...props} />
patientFormRenderers['anexar-documentos'] = (props) => <AnexarDocumentosForm {...props} />
patientFormValueNormalizers['queixa-inicial'] = normalizeQueixaInicialValues

for (const id of QUESTIONNAIRE_IDS) {
  if (id === 'inventario_asperger' || id === 'adir' || id === 'vineland') continue
  patientFormRenderers[id] = (props) => <QuestionnaireForm {...props} />
}
patientFormRenderers.inventario_asperger = (props) => <InventarioAspergerForm {...props} />
patientFormRenderers.adir = (props) => <AdirForm {...props} />
patientFormRenderers.vineland = (props) => <VinelandForm {...props} />
