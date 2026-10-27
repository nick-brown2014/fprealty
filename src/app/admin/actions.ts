'use server'

import { randomBytes } from 'node:crypto'
import path from 'node:path'
import { put } from '@vercel/blob'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import sanitizeHtml from 'sanitize-html'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import { fromDenverInputValue } from '@/lib/webinars'

export type FormState = { error?: string; message?: string }

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim()
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const POST_IMAGE_STORAGE_DIR = 'blog'
const WEBINAR_IMAGE_STORAGE_DIR = 'webinars'
const IMAGE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
}
const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024

function sanitizePostContent(html: string) {
  return sanitizeHtml(html, {
    allowedTags: ['p', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'strong', 'em', 'u', 's', 'br', 'hr'],
    allowedAttributes: { a: ['href', 'target', 'rel'], img: ['src', 'alt'] },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesAppliedToAttributes: ['href', 'src'],
    allowProtocolRelative: false,
  }).trim()
}

type UploadResult = { url: string } | { error: string }

async function uploadImage(formData: FormData, storageDir: string): Promise<UploadResult> {
  await requireAdmin()
  const file = formData.get('image')
  if (!(file instanceof File) || file.size === 0) return { error: 'Choose an image to upload.' }
  const extension = IMAGE_EXTENSIONS[file.type]
  if (!extension) return { error: 'Image must be a JPEG, PNG, WebP, or GIF.' }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { error: 'Image must be 8 MB or smaller.' }
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { error: 'Image storage is not configured. Set BLOB_READ_WRITE_TOKEN.' }
  }
  const base = slugify(path.basename(file.name, path.extname(file.name))) || 'image'
  const filename = `${base}-${randomBytes(4).toString('hex')}${extension}`
  try {
    const blob = await put(`${storageDir}/${filename}`, Buffer.from(await file.arrayBuffer()), {
      access: 'public',
      contentType: file.type,
      addRandomSuffix: false,
    })
    return { url: blob.url }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'The image could not be saved.' }
  }
}

export async function uploadPostImage(formData: FormData): Promise<UploadResult> {
  return uploadImage(formData, POST_IMAGE_STORAGE_DIR)
}

export async function uploadWebinarImage(formData: FormData): Promise<UploadResult> {
  return uploadImage(formData, WEBINAR_IMAGE_STORAGE_DIR)
}

function revalidateBlog(slug?: string) {
  revalidatePath('/blog')
  revalidatePath('/admin/posts')
  if (slug) revalidatePath(`/blog/${slug}`)
}

export async function savePost(_prevState: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin()

  const id = text(formData, 'id')
  const title = text(formData, 'title')
  const excerpt = text(formData, 'excerpt')
  const content = sanitizePostContent(text(formData, 'content'))
  const heroImage = text(formData, 'heroImage')
  const publishedAt = text(formData, 'publishedAt')
  const slug = slugify(text(formData, 'slug') || title)
  const categories = text(formData, 'categories')
    .split(',')
    .map((category) => slugify(category))
    .filter(Boolean)

  if (!title) return { error: 'Title is required.' }
  if (!slug) return { error: 'Slug is required.' }
  if (!excerpt) return { error: 'Excerpt is required.' }
  if (!publishedAt) return { error: 'Publish date is required.' }

  const clash = await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } })
  if (clash && clash.id !== id) return { error: `The slug "${slug}" is already in use.` }

  const data = {
    slug,
    title,
    excerpt,
    content: content || null,
    heroImage: heroImage || null,
    categories,
    publishedAt: new Date(`${publishedAt}T00:00:00`),
  }

  if (id) {
    await prisma.blogPost.update({ where: { id }, data })
  } else {
    await prisma.blogPost.create({ data })
  }

  revalidateBlog(slug)
  redirect('/admin/posts')
}

export async function deletePost(formData: FormData) {
  await requireAdmin()
  const id = text(formData, 'id')
  if (!id) return
  const post = await prisma.blogPost.delete({ where: { id } })
  revalidateBlog(post.slug)
  redirect('/admin/posts')
}

function revalidateWebinars() {
  revalidatePath('/')
  revalidatePath('/admin/webinars')
}

function isHttpUrl(value: string) {
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol)
  } catch {
    return false
  }
}

export async function saveWebinar(_prevState: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin()

  const id = text(formData, 'id')
  const title = text(formData, 'title')
  const description = text(formData, 'description')
  const image = text(formData, 'image')
  const signUpUrl = text(formData, 'signUpUrl')
  const startsAt = fromDenverInputValue(text(formData, 'startsAt'))

  if (!title) return { error: 'Title is required.' }
  if (!description) return { error: 'Description is required.' }
  if (!startsAt) return { error: 'Date and time are required.' }
  if (signUpUrl && !isHttpUrl(signUpUrl)) return { error: 'Sign-up URL must start with http:// or https://.' }

  const data = {
    title,
    description,
    image: image || null,
    signUpUrl: signUpUrl || null,
    startsAt,
  }

  if (id) {
    await prisma.webinar.update({ where: { id }, data })
  } else {
    await prisma.webinar.create({ data })
  }

  revalidateWebinars()
  redirect('/admin/webinars')
}

export async function deleteWebinar(formData: FormData) {
  await requireAdmin()
  const id = text(formData, 'id')
  if (!id) return
  await prisma.webinar.delete({ where: { id } })
  revalidateWebinars()
  redirect('/admin/webinars')
}
