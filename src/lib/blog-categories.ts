import { prisma } from './prisma'

export async function blogCategories() {
  const posts = await prisma.blogPost.findMany({ select: { categories: true } })
  return [...new Set(posts.flatMap((post) => post.categories))].sort()
}
