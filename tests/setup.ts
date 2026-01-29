import { vi } from 'vitest'
import { mockDeep, mockReset } from 'vitest-mock-extended'
import { PrismaClient } from '@prisma/client'

export const prismaMock = mockDeep<PrismaClient>()

vi.mock('@/lib/prisma', () => ({
  prisma: prismaMock
}))

beforeEach(() => {
  mockReset(prismaMock)
})
