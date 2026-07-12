import { Link } from 'react-router-dom'
import { cookiePolicy } from '../content/cookies.pt'
import { Container } from '../components/layout/Container'
import styles from './CookiesPolicyPage.module.css'

export function CookiesPolicyPage() {
  return (
    <Container as="div" className={styles.page}>
      <nav className={styles.back}>
        <Link to="/">← Voltar ao início</Link>
      </nav>

      <header className={styles.header}>
        <h1 className={styles.title}>{cookiePolicy.title}</h1>
        <p className={styles.updated}>Última atualização: {cookiePolicy.lastUpdated}</p>
        <p className={styles.intro}>{cookiePolicy.intro}</p>
      </header>

      <div className={styles.content}>
        {cookiePolicy.sections.map((section) => (
          <section key={section.id} id={section.id} className={styles.section}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
            {'bullets' in section && section.bullets && (
              <ul className={styles.list}>
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {'afterBullets' in section &&
              section.afterBullets?.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
            {'list' in section &&
              section.list?.map((item) => (
              <article key={item.name} className={styles.card}>
                <h3 className={styles.cardTitle}>{item.name}</h3>
                <dl className={styles.dl}>
                  <div>
                    <dt>Finalidade</dt>
                    <dd>{item.purpose}</dd>
                  </div>
                  <div>
                    <dt>Fornecedor</dt>
                    <dd>{item.provider}</dd>
                  </div>
                  <div>
                    <dt>Cookies / dados</dt>
                    <dd>{item.cookies}</dd>
                  </div>
                  <div>
                    <dt>Mais informação</dt>
                    <dd>
                      <a href={item.moreInfo} target="_blank" rel="noopener noreferrer">
                        {item.moreInfo}
                      </a>
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </section>
        ))}
      </div>

      <aside className={styles.related}>
        <h2 className={styles.relatedTitle}>Documentos relacionados</h2>
        <p>
          <a href={cookiePolicy.dataProtectionPdf} target="_blank" rel="noopener noreferrer">
            Consentimento informado e proteção de dados (PDF)
          </a>
        </p>
      </aside>
    </Container>
  )
}
