import BlogIndex, { categoryName } from '../../blog-index'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return { title: `${categoryName(slug)} · Porter Real Estate blog` }
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <BlogIndex page={1} category={slug} />
}
