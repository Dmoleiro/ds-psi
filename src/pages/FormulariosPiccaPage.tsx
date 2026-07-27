import { Link } from 'react-router-dom'
import { piccaCatalog, piccaFormsPage } from '../content/site.pt'
import { Container } from '../components/layout/Container'
import { Card } from '../components/ui/Card'
import styles from './FormulariosPiccaPage.module.css'

export function FormulariosPiccaPage() {
  return (
    <Container as="div" className={styles.page}>
      <nav className={styles.back}>
        <Link to="/">← Voltar ao início</Link>
      </nav>

      <header className={styles.header}>
        <p className={styles.acronym}>{piccaFormsPage.acronym}</p>
        <h1 className={styles.title}>{piccaFormsPage.title}</h1>
        <p className={styles.intro}>{piccaFormsPage.intro}</p>
        <p className={styles.intro}>{piccaFormsPage.patientAccess}</p>
      </header>

      <section className={styles.catalog} aria-labelledby="picca-catalog-title">
        <h2 id="picca-catalog-title" className={styles.catalogTitle}>
          {piccaFormsPage.catalogTitle}
        </h2>
        <p className={styles.catalogIntro}>{piccaFormsPage.catalogIntro}</p>

        {piccaCatalog.map((volume) => (
          <div key={volume.volume} className={styles.volume}>
            <h3 className={styles.volumeTitle}>{volume.title}</h3>
            <ol className={styles.moduleList}>
              {volume.modules.map((mod) => (
                <li key={mod.number}>
                  <Card as="article" className={styles.moduleCard}>
                    <div className={styles.moduleHeader}>
                      <p className={styles.moduleTitle}>
                        Módulo {mod.number} — {mod.title}
                      </p>
                      <span
                        className={
                          mod.status === 'available' ? styles.statusAvailable : styles.statusSoon
                        }
                      >
                        {piccaFormsPage.moduleStatus[mod.status]}
                      </span>
                    </div>
                    {mod.description && <p className={styles.moduleDescription}>{mod.description}</p>}
                  </Card>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </section>
    </Container>
  )
}
