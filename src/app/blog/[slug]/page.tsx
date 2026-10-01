import Link from 'next/link'
import { notFound } from 'next/navigation'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'
import { prisma } from '@/lib/prisma'
import { categoryHref, categoryName } from '../blog-index'

export const dynamic = 'force-dynamic'

const articleBodyClass =
  'mt-8 text-lg text-gray-700 leading-relaxed [&_h1]:font-serif [&_h1]:text-3xl [&_h1]:mt-10 [&_h1]:mb-4 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mt-6 [&_h4]:mb-2 [&_p]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_a]:text-primary [&_a]:underline [&_img]:rounded-lg [&_img]:my-6 [&_hr]:my-8 [&_hr]:border-gray-300'

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug } })

  if (!post) notFound()

  return (
    <div className='w-full font-body bg-[#F8F6F2] text-black min-h-screen'>
      <Nav alwaysSolid />
      <div className='max-w-3xl mx-auto px-6 pt-28 pb-16'>
        <article>
          <header>
            <p className='font-condensed text-xs font-bold tracking-[0.22em] uppercase text-primary mb-3'>
              Blog
            </p>
            <h1 className='font-serif text-4xl lg:text-5xl leading-tight'>{post.title}</h1>
            <div className='flex flex-wrap items-center gap-3 mt-4'>
              <time className='text-sm text-gray-500'>
                {new Intl.DateTimeFormat('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                }).format(post.publishedAt)}
              </time>
              {post.categories.map((category) => (
                <Link
                  className='px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition'
                  href={categoryHref(category)}
                  key={category}
                >
                  {categoryName(category)}
                </Link>
              ))}
            </div>
            {post.heroImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className='w-full rounded-lg shadow-md mt-8'
                src={post.heroImage}
                alt={post.title}
              />
            )}
          </header>
          <div
            className={articleBodyClass}
            dangerouslySetInnerHTML={{ __html: post.content ?? `<p>${post.excerpt}</p>` }}
          />
          <div className='mt-12'>
            <Link
              href='/blog'
              className='inline-block px-6 py-3 border border-primary text-primary font-semibold rounded-md hover:bg-primary hover:text-white transition'
            >
              ← Back to blog
            </Link>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  )
}
