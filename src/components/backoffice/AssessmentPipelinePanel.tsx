import { useCallback, useEffect, useState } from 'react'
import {
  ApiError,
  coordinatorApi,
  therapistApi,
  type AssessmentPipeline,
  type AssessmentPipelineStageStatus,
} from '../../lib/api'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import styles from './AssessmentPipelinePanel.module.css'

type Props = {
  token: string
  patientId: string
  readOnly?: boolean
  onOpenIntakeTab?: () => void
  onOpenPiccaTab?: () => void
  onOpenDocumentsTab?: () => void
}

function stageStatusLabel(status: AssessmentPipelineStageStatus): string {
  switch (status) {
    case 'complete':
      return 'Concluída'
    case 'in_progress':
      return 'Em curso'
    case 'skipped':
      return 'N/A'
    default:
      return 'Por iniciar'
  }
}

function stageStatusVariant(status: AssessmentPipelineStageStatus): 'default' | 'muted' | 'accent' {
  switch (status) {
    case 'complete':
      return 'accent'
    case 'in_progress':
      return 'default'
    default:
      return 'muted'
  }
}

function formatReportDate(value: string | null): string {
  if (!value) return ''
  return new Date(value).toLocaleDateString('pt-PT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function AssessmentPipelinePanel({
  token,
  patientId,
  readOnly = false,
  onOpenIntakeTab,
  onOpenPiccaTab,
  onOpenDocumentsTab,
}: Props) {
  const [pipeline, setPipeline] = useState<AssessmentPipeline | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<'advance' | 'report' | null>(null)

  const loadPipeline = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = readOnly
        ? await coordinatorApi.getAssessmentPipeline(token, patientId)
        : await therapistApi.getAssessmentPipeline(token, patientId)
      setPipeline(result.pipeline)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível carregar o estado da avaliação')
    } finally {
      setLoading(false)
    }
  }, [token, patientId, readOnly])

  useEffect(() => {
    void loadPipeline()
  }, [loadPipeline])

  async function handleAdvance() {
    if (!pipeline?.nextStage) return
    setActionLoading('advance')
    setError('')
    try {
      const result = await therapistApi.updateAssessmentPipeline(token, patientId, { advance: true })
      setPipeline(result.pipeline)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível avançar a etapa')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleToggleReportDelivered() {
    setActionLoading('report')
    setError('')
    try {
      const result = await therapistApi.updateAssessmentPipeline(token, patientId, {
        reportDeliveredAt: pipeline?.reportDeliveredAt ? null : new Date().toISOString(),
      })
      setPipeline(result.pipeline)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível atualizar a entrega do relatório')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <Card as="section" className={styles.card}>
        <h2>Estado da avaliação</h2>
        <p className={styles.muted}>A carregar…</p>
      </Card>
    )
  }

  if (!pipeline) {
    return (
      <Card as="section" className={styles.card}>
        <h2>Estado da avaliação</h2>
        <p className={styles.error}>{error || 'Não foi possível carregar o estado da avaliação.'}</p>
        {!readOnly && (
          <Button type="button" variant="outline" onClick={() => void loadPipeline()}>
            Tentar novamente
          </Button>
        )}
      </Card>
    )
  }

  const currentStage = pipeline.stages.find((stage) => stage.id === pipeline.currentStage)

  return (
    <Card as="section" className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2>Estado da avaliação</h2>
          <p className={styles.muted}>
            Etapa atual: <strong>{pipeline.currentStageLabel}</strong>
          </p>
        </div>
        {currentStage && (
          <Badge variant={stageStatusVariant(currentStage.status)}>
            {stageStatusLabel(currentStage.status)}
          </Badge>
        )}
      </div>

      <ol className={styles.stepper} aria-label="Etapas do caso de avaliação">
        {pipeline.stages.map((stage, index) => {
          const isCurrent = stage.id === pipeline.currentStage
          const isPast =
            pipeline.stages.findIndex((item) => item.id === pipeline.currentStage) > index ||
            stage.status === 'complete'
          return (
            <li
              key={stage.id}
              className={[
                styles.step,
                isCurrent ? styles.stepCurrent : '',
                isPast ? styles.stepComplete : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className={styles.stepMarker} aria-hidden="true">
                {stage.status === 'complete' ? '✓' : index + 1}
              </span>
              <div className={styles.stepBody}>
                <span className={styles.stepLabel}>{stage.label}</span>
                <span className={styles.stepStatus}>{stageStatusLabel(stage.status)}</span>
              </div>
            </li>
          )
        })}
      </ol>

      {pipeline.currentStageBlockers.length > 0 && (
        <div className={styles.blockers}>
          <h3>Pendências</h3>
          <ul>
            {pipeline.currentStageBlockers.map((blocker) => (
              <li key={blocker}>{blocker}</li>
            ))}
          </ul>
          <div className={styles.quickLinks}>
            {pipeline.currentStage === 'intake' && onOpenIntakeTab && (
              <button type="button" className={styles.linkButton} onClick={onOpenIntakeTab}>
                Ir para formulários
              </button>
            )}
            {pipeline.currentStage === 'picca' && onOpenPiccaTab && (
              <button type="button" className={styles.linkButton} onClick={onOpenPiccaTab}>
                Ir para PICCA
              </button>
            )}
            {pipeline.currentStage === 'relatorio' && onOpenDocumentsTab && (
              <button type="button" className={styles.linkButton} onClick={onOpenDocumentsTab}>
                Ir para documentos
              </button>
            )}
          </div>
        </div>
      )}

      {pipeline.currentStage === 'relatorio' && !readOnly && (
        <div className={styles.reportAction}>
          <p className={styles.muted}>
            {pipeline.reportDeliveredAt
              ? `Relatório entregue em ${formatReportDate(pipeline.reportDeliveredAt)}.`
              : 'Registe quando o relatório foi entregue à família.'}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => void handleToggleReportDelivered()}
            disabled={actionLoading === 'report'}
          >
            {actionLoading === 'report'
              ? 'A guardar…'
              : pipeline.reportDeliveredAt
                ? 'Anular entrega'
                : 'Marcar relatório como entregue'}
          </Button>
        </div>
      )}

      {!readOnly && pipeline.nextStage && (
        <div className={styles.footer}>
          <Button
            type="button"
            onClick={() => void handleAdvance()}
            disabled={!pipeline.canAdvance || actionLoading === 'advance'}
          >
            {actionLoading === 'advance'
              ? 'A avançar…'
              : `Avançar para ${pipeline.nextStageLabel}`}
          </Button>
          {!pipeline.canAdvance && (
            <p className={styles.muted}>Resolva as pendências acima para avançar.</p>
          )}
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}
    </Card>
  )
}
