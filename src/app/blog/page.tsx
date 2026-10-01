import BlogIndex from './blog-index'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Blog | Porter Real Estate',
  description:
    'Northern Colorado real estate insights: market updates, buying and selling guides, and local expertise from Porter Real Estate.',
}

export default function BlogPage() {
  return <BlogIndex page={1} />
}
