import 'dotenv/config'
import { PrismaClient, UserRole } from '@prisma/client'
import { hashPassword } from '../src/lib/password.js'

const prisma = new PrismaClient()

const formDefinitions = [
  {
    id: 'ficha-inscricao',
    title: 'Ficha de inscrição',
    description: 'Dados da criança/jovem, encarregado de educação e motivo do pedido.',
  },
]

async function main() {
  await prisma.formDefinition.updateMany({
    where: { id: { in: ['intake', 'consent', 'history'] } },
    data: { active: false },
  })

  for (const form of formDefinitions) {
    await prisma.formDefinition.upsert({
      where: { id: form.id },
      create: {
        id: form.id,
        title: form.title,
        description: form.description,
        schemaJson: {},
        active: true,
      },
      update: {
        title: form.title,
        description: form.description,
        active: true,
      },
    })
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@danielasantos.work'
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'ChangeMeAdmin123!'

  const passwordHash = await hashPassword(adminPassword)
  await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      name: 'Administrador',
      role: UserRole.admin,
      passwordHash,
    },
    update: {
      name: 'Administrador',
      role: UserRole.admin,
      passwordHash,
      active: true,
    },
  })

  console.log('Seed complete.')
  console.log(`Admin: ${adminEmail}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
