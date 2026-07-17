import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { WorkshopCard, WorkshopsEmptyState } from '../components/workshops/WorkshopCard'
import gridStyles from '../components/workshops/WorkshopCard.module.css'
import { Container } from '../components/layout/Container'
import { workshopsPage } from '../content/site.pt'
import { ApiError, workshopApi, type WorkshopSummary } from '../lib/api'
import styles from './FormulariosPiccaPage.module.css'

export function WorkshopsPublicPage() {
  const [workshops, setWorkshops] = useState<WorkshopSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    workshopApi
      .listPublic('upcoming')
      .then((data) => setWorkshops(data.workshops))
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Não foi possível carregar os workshops')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <Container as="div" className={styles.page}>
      <nav className={styles.back}>
        <Link to="/">← Voltar ao início</Link>
      </nav>

      <header className={styles.header}>
        <h1 className={styles.title}>{workshopsPage.title}</h1>
        <p className={styles.intro}>{workshopsPage.intro}</p>
      </header>

      {loading ? (
        <p className={styles.intro}>A carregar…</p>
      ) : error ? (
        <p className={styles.intro}>{error}</p>
      ) : workshops.length === 0 ? (
        <WorkshopsEmptyState />
      ) : (
        <div className={gridStyles.grid}>
          {workshops.map((workshop) => (
            <WorkshopCard key={workshop.id} workshop={workshop} />
          ))}
        </div>
      )}

      <p className={styles.note}>
        <Link to="/workshops/passados">Ver eventos passados →</Link>
      </p>
    </Container>
  )
}
