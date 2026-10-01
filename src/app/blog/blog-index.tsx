import Link from 'next/link'
import { notFound } from 'next/navigation'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'
import { prisma } from '@/lib/prisma'

const PAGE_SIZE = 10

export function categoryName(slug: string) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function categoryHref(slug: string, page = 1) {
  return page > 1 ? `/blog/category/${slug}/page/${page}` : `/blog/category/${slug}`
}

function blogHref(page: number) {
  return page > 1 ? `/blog/page/${page}` : '/blog'
}

export default async function BlogIndex({
  page,
  category,
}: {
  page: number
  category?: string
}) {
  const where = category ? { categories: { has: category } } : {}
  const [posts, total, allCategories] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.blogPost.count({ where }),
    prisma.blogPost.findMany({ select: { categories: true } }),
  ])
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  if (page < 1 || page > totalPages || posts.length === 0) notFound()

  const counts = new Map<string, number>()
  for (const post of allCategories) {
    for (const slug of post.categories) counts.set(slug, (counts.get(slug) ?? 0) + 1)
  }
  const categories = [...counts.entries()].sort((a, b) => b[1] - a[1])
  const href = (nextPage: number) =>
    category ? categoryHref(category, nextPage) : blogHref(nextPage)

  return (
    <div className='w-full font-body bg-[#F8F6F2] text-black min-h-screen'>
      <Nav alwaysSolid />
      <div className='max-w-7xl mx-auto px-6 pt-28 pb-16'>
        <div className='flex flex-col lg:flex-row gap-10'>
          <aside className='lg:w-64 shrink-0'>
            <div className='bg-white rounded-lg shadow-md p-6 lg:sticky lg:top-24'>
              <h2 className='font-condensed text-xs font-bold tracking-[0.22em] uppercase text-primary mb-4'>
                Categories
              </h2>
              <ul className='flex flex-col gap-1'>
                <li>
                  <Link
                    href='/blog'
                    className={`block px-3 py-2 rounded text-sm transition hover:text-primary ${
                      category ? 'text-gray-700' : 'text-primary font-semibold bg-primary/5'
                    }`}
                  >
                    All posts ({allCategories.length})
                  </Link>
                </li>
                {categories.map(([slug, count]) => (
                  <li key={slug}>
                    <Link
                      href={categoryHref(slug)}
                      className={`block px-3 py-2 rounded text-sm transition hover:text-primary ${
                        slug === category ? 'text-primary font-semibold bg-primary/5' : 'text-gray-700'
                      }`}
                    >
                      {categoryName(slug)} ({count})
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className='flex-1 min-w-0'>
            <div className='mb-10'>
              <p className='font-condensed text-xs font-bold tracking-[0.22em] uppercase text-primary mb-3'>
                Blog
              </p>
              {category ? (
                <>
                  <h1 className='font-serif text-4xl lg:text-5xl mb-4'>{categoryName(category)}</h1>
                  <p className='text-lg text-gray-600'>
                    {total} post{total === 1 ? '' : 's'} filed under {categoryName(category)}.{' '}
                    <Link className='text-primary hover:underline' href='/blog'>
                      View all posts
                    </Link>
                  </p>
                </>
              ) : (
                <>
                  <h1 className='font-serif text-4xl lg:text-5xl mb-4'>
                    Northern Colorado Real Estate Insights
                  </h1>
                  <p className='text-lg text-gray-600'>
                    Market updates, buying and selling guides, and local expertise from the Porter
                    Real Estate team.
                  </p>
                </>
              )}
            </div>

            <div className='flex flex-col gap-6'>
              {posts.map((post) => (
                <article
                  className='bg-white rounded-lg shadow-md p-6 lg:p-8 hover:shadow-lg transition'
                  key={post.slug}
                >
                  <Link href={`/blog/${post.slug}`} className='block group'>
                    <time className='text-sm text-gray-500'>
                      {new Intl.DateTimeFormat('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }).format(post.publishedAt)}
                    </time>
                    <h2 className='font-serif text-2xl mt-1 mb-2 group-hover:text-primary transition'>
                      {post.title}
                    </h2>
                    <p className='text-gray-600'>{post.excerpt}</p>
                  </Link>
                  <div className='flex flex-wrap items-center justify-between gap-3 mt-4'>
                    <div className='flex flex-wrap gap-2'>
                      {post.categories.map((slug) => (
                        <Link
                          className='px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition'
                          href={categoryHref(slug)}
                          key={slug}
                        >
                          {categoryName(slug)}
                        </Link>
                      ))}
                    </div>
                    <Link
                      className='text-primary font-semibold text-sm hover:underline'
                      href={`/blog/${post.slug}`}
                    >
                      Read article →
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <nav className='flex justify-between items-center mt-10'>
              {page > 1 ? (
                <Link href={href(page - 1)} className='text-primary font-semibold hover:underline'>
                  ← Newer posts
                </Link>
              ) : (
                <span />
              )}
              {page < totalPages && (
                <Link href={href(page + 1)} className='text-primary font-semibold hover:underline'>
                  Older posts →
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
