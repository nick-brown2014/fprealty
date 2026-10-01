'use client'

import Link from 'next/link'
import { useActionState, useRef, useState } from 'react'
import { deletePost, savePost, uploadPostImage, type FormState } from '../actions'
import PostEditor from './post-editor'

export type PostFormValues = {
  id?: string
  slug: string
  title: string
  excerpt: string
  content: string
  categories: string[]
  heroImage: string
  publishedAt: string
}

const initialState: FormState = {}

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function categoryLabel(slug: string) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function PostForm({
  post,
  existingCategories,
}: {
  post: PostFormValues
  existingCategories: string[]
}) {
  const [state, formAction, pending] = useActionState(savePost, initialState)
  const [options, setOptions] = useState(() =>
    [...new Set([...existingCategories, ...post.categories])].sort()
  )
  const [selected, setSelected] = useState(() => new Set(post.categories))
  const [newCategory, setNewCategory] = useState('')
  const [heroImage, setHeroImage] = useState(post.heroImage)
  const [heroError, setHeroError] = useState('')
  const [heroUploading, setHeroUploading] = useState(false)
  const heroInput = useRef<HTMLInputElement>(null)

  function addCategory() {
    const slug = slugify(newCategory)
    if (!slug) return
    setOptions((current) => (current.includes(slug) ? current : [...current, slug].sort()))
    setSelected((current) => new Set(current).add(slug))
    setNewCategory('')
  }

  function toggleCategory(slug: string, checked: boolean) {
    setSelected((current) => {
      const next = new Set(current)
      if (checked) next.add(slug)
      else next.delete(slug)
      return next
    })
  }

  async function uploadHero(file: File) {
    setHeroUploading(true)
    setHeroError('')
    const formData = new FormData()
    formData.set('image', file)
    const result = await uploadPostImage(formData)
    setHeroUploading(false)
    if ('error' in result) {
      setHeroError(result.error)
      return
    }
    setHeroImage(result.url)
  }

  return (
    <>
      <form action={formAction} className='bg-white rounded-lg shadow-md p-6 space-y-4'>
        {post.id && <input type='hidden' name='id' value={post.id} />}
        <input type='hidden' name='categories' value={[...selected].join(',')} />
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Title</label>
          <input name='title' defaultValue={post.title} required className={inputClass} />
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Slug</label>
            <input
              name='slug'
              defaultValue={post.slug}
              placeholder='generated from title'
              className={inputClass}
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Publish date</label>
            <input
              type='date'
              name='publishedAt'
              defaultValue={post.publishedAt}
              required
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Excerpt</label>
          <textarea name='excerpt' rows={3} defaultValue={post.excerpt} required className={inputClass} />
        </div>
        <fieldset>
          <legend className='block text-sm font-medium text-gray-700 mb-1'>Categories</legend>
          <div className='flex flex-wrap gap-4 mb-2'>
            {options.map((slug) => (
              <label className='flex items-center gap-2 text-sm text-gray-700 cursor-pointer' key={slug}>
                <input
                  type='checkbox'
                  checked={selected.has(slug)}
                  onChange={(event) => toggleCategory(slug, event.target.checked)}
                  className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer'
                />
                {categoryLabel(slug)}
              </label>
            ))}
          </div>
          <div className='flex gap-2'>
            <input
              value={newCategory}
              placeholder='New category name'
              onChange={(event) => setNewCategory(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  addCategory()
                }
              }}
              className={inputClass}
            />
            <button
              className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 whitespace-nowrap'
              type='button'
              onClick={addCategory}
            >
              Add category
            </button>
          </div>
        </fieldset>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Hero image</label>
          <div className='flex gap-2'>
            <input
              name='heroImage'
              value={heroImage}
              onChange={(event) => setHeroImage(event.target.value)}
              placeholder='Paste a URL or upload an image'
              className={inputClass}
            />
            <button
              className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 whitespace-nowrap'
              type='button'
              disabled={heroUploading}
              onClick={() => heroInput.current?.click()}
            >
              {heroUploading ? 'Uploading…' : 'Upload'}
            </button>
            <input
              ref={heroInput}
              type='file'
              accept='image/*'
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0]
                event.target.value = ''
                if (file) void uploadHero(file)
              }}
            />
          </div>
          {heroError && <p className='mt-1 text-sm text-red-600'>{heroError}</p>}
          {heroImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className='mt-2 max-h-48 rounded-md border border-gray-200' src={heroImage} alt='' />
          )}
        </div>
        <div>
          <span className='block text-sm font-medium text-gray-700 mb-1'>Content</span>
          <PostEditor name='content' initialContent={post.content} />
        </div>
        {state.error && (
          <p className='p-3 bg-red-100 border border-red-400 text-red-700 rounded'>{state.error}</p>
        )}
        <div className='flex gap-3 pt-2'>
          <button
            className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50'
            type='submit'
            disabled={pending}
          >
            {pending ? 'Saving…' : 'Save post'}
          </button>
          <Link
            className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
            href='/admin/posts'
          >
            Cancel
          </Link>
        </div>
      </form>

      {post.id && (
        <form action={deletePost} className='mt-8 bg-white rounded-lg shadow-md p-6 border border-red-200'>
          <input type='hidden' name='id' value={post.id} />
          <div className='flex justify-between items-center'>
            <div>
              <h2 className='text-lg font-semibold text-red-600'>Delete post</h2>
              <p className='text-sm text-gray-500'>This permanently removes the post from the site.</p>
            </div>
            <button
              className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
              type='submit'
              onClick={(event) => {
                if (!window.confirm('Delete this post? This cannot be undone.')) {
                  event.preventDefault()
                }
              }}
            >
              Delete
            </button>
          </div>
        </form>
      )}
    </>
  )
}
