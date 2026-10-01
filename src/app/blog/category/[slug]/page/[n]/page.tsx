import { notFound } from 'next/navigation'
import BlogIndex from '../../../../blog-index'

export const dynamic = 'force-dynamic'

export default async function BlogCategoryPaginatedPage({
  params,
}: {
  params: Promise<{ slug: string; n: string }>
}) {
  const { slug, n } = await params
  const page = Number(n)
  if (!Number.isInteger(page) || page < 1) notFound()
  return <BlogIndex page={page} category={slug} />
}
