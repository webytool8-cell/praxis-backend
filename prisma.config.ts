import { defineConfig } from 'prisma/config'

export default defineConfig({
  migrate: {
    async adapter(env: Record<string, string | undefined>) {
      const { Pool } = await import('pg')
      const { PrismaPg } = await import('@prisma/adapter-pg')
      const pool = new Pool({ connectionString: env.DATABASE_URL })
      return new PrismaPg(pool)
    },
  },
})
