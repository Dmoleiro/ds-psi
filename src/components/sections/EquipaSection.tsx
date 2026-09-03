import { useEffect } from 'react'
import type { TeamMember } from '../../content/team.pt'
import { teamPage } from '../../content/team.pt'
import { hiddenTeamMember } from '../../content/teamEasterEgg.pt'
import { useEasterEggUnlocked } from '../../lib/easterEgg'
import { Card } from '../ui/Card'
import { PortraitPhoto } from '../ui/PortraitPhoto'
import { Section } from '../layout/Section'
import styles from './EquipaSection.module.css'

function TeamMemberProfile({ member }: { member: TeamMember }) {
  return (
    <article
      id={member.id}
      className={`${styles.member} ${member.easterEgg ? styles.memberEasterEgg : ''}`}
    >
      <div className={styles.memberHeader}>
        <PortraitPhoto
          src={member.portrait.src}
          alt={member.portrait.alt}
          align={member.portrait.align}
          frameClassName={styles.photoFrame}
          width={360}
          height={360}
        />

        <div className={styles.memberIntro}>
          <h3 className={styles.memberName}>{member.name}</h3>
          <p className={styles.memberRole}>{member.role}</p>
          {member.availabilityNote && (
            <p className={styles.availabilityNote}>{member.availabilityNote}</p>
          )}
          {member.tagline && <p className={styles.tagline}>{member.tagline}</p>}
          <p className={styles.intro}>{member.intro}</p>
        </div>
      </div>

      {member.interventionFocus && (
        <Card className={styles.block}>
          <h4 className={styles.blockTitle}>{member.interventionFocus.title}</h4>
          <p className={styles.interventionFocus}>{member.interventionFocus.description}</p>
        </Card>
      )}

      {member.credentials && (
        <Card className={styles.block}>
          <h4 className={styles.blockTitle}>Formação e experiência</h4>
          <ul className={styles.list}>
            {member.credentials.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      )}

      {member.audiences && (
        <div className={styles.audiences}>
          <h4 className={styles.blockTitle}>Atendimento para</h4>
          <div className={styles.audienceGrid}>
            {member.audiences.map((audience) => (
              <Card key={audience.title} className={styles.audienceCard}>
                <h5 className={styles.audienceTitle}>{audience.title}</h5>
                <ul className={styles.list}>
                  {audience.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      )}

      {member.practiceAreas && (
        <div className={styles.block}>
          <h4 className={styles.blockTitle}>Áreas de atuação</h4>
          <div className={styles.practiceGrid}>
            {member.practiceAreas.map((area) => (
              <Card key={area.title} className={styles.practiceCard}>
                <h5 className={styles.practiceTitle}>{area.title}</h5>
                <p className={styles.practiceDescription}>{area.description}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Card className={styles.block}>
        <h4 className={styles.blockTitle}>
          {member.approachTitle ??
            (member.practiceAreas ? 'A nossa abordagem' : 'A minha abordagem')}
        </h4>
        <ul className={styles.approachList}>
          {member.approach.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {member.closing && <p className={styles.closing}>{member.closing}</p>}
      </Card>
    </article>
  )
}

export function EquipaSection() {
  const easterEggUnlocked = useEasterEggUnlocked()
  const members = easterEggUnlocked ? [...teamPage.members, hiddenTeamMember] : teamPage.members

  useEffect(() => {
    if (!easterEggUnlocked) return

    const timer = window.setTimeout(() => {
      document.getElementById(hiddenTeamMember.id)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 0)

    return () => window.clearTimeout(timer)
  }, [easterEggUnlocked])

  return (
    <Section id="equipa" title={teamPage.title} subtitle={teamPage.intro}>
      <div className={styles.members}>
        {members.map((member) => (
          <TeamMemberProfile key={member.id} member={member} />
        ))}
      </div>
    </Section>
  )
}
