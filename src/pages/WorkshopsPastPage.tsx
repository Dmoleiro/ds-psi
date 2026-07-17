import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { WorkshopCard } from '../components/workshops/WorkshopCard'
import gridStyles from '../components/workshops/WorkshopCard.module.css'
import { Container } from '../components/layout/Container'
import { workshopsPage } from '../content/site.pt'
import { ApiError, workshopApi, type WorkshopSummary } from '../lib/api'
import styles from './FormulariosPiccaPage.module.css'

export function WorkshopsPastPage() {
  const [workshops, setWorkshops] = useState<WorkshopSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    workshopApi
      .listPublic('past')
      .then((data) => setWorkshops(data.workshops))
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Não foi possível carregar os eventos passados')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <Container as="div" className={styles.page}>
      <nav className={styles.back}>
        <Link to="/workshops">← Voltar aos workshops</Link>
      </nav>

      <header className={styles.header}>
        <h1 className={styles.title}>{workshopsPage.pastTitle}</h1>
        <p className={styles.intro}>{workshopsPage.pastIntro}</p>
      </header>

      {loading ? (
        <p className={styles.intro}>A carregar…</p>
      ) : error ? (
        <p className={styles.intro}>{error}</p>
      ) : workshops.length === 0 ? (
        <p className={styles.intro}>Ainda não existem eventos passados registados.</p>
      ) : (
        <div className={gridStyles.grid}>
          {workshops.map((workshop) => (
            <WorkshopCard key={workshop.id} workshop={workshop} />
          ))}
        </div>
      )}
    </Container>
  )
}
