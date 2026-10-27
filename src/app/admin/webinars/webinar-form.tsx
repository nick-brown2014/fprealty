'use client'

import Link from 'next/link'
import { useActionState, useRef, useState } from 'react'
import { deleteWebinar, saveWebinar, uploadWebinarImage, type FormState } from '../actions'

export type WebinarFormValues = {
  id?: string
  title: string
  description: string
  image: string
  signUpUrl: string
  startsAt: string
}

const initialState: FormState = {}

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'

export default function WebinarForm({ webinar }: { webinar: WebinarFormValues }) {
  const [state, formAction, pending] = useActionState(saveWebinar, initialState)
  const [image, setImage] = useState(webinar.image)
  const [imageError, setImageError] = useState('')
  const [imageUploading, setImageUploading] = useState(false)
  const imageInput = useRef<HTMLInputElement>(null)

  async function uploadImage(file: File) {
    setImageUploading(true)
    setImageError('')
    const formData = new FormData()
    formData.set('image', file)
    const result = await uploadWebinarImage(formData)
    setImageUploading(false)
    if ('error' in result) {
      setImageError(result.error)
      return
    }
    setImage(result.url)
  }

  return (
    <>
      <form action={formAction} className='bg-white rounded-lg shadow-md p-6 space-y-4'>
        {webinar.id && <input type='hidden' name='id' value={webinar.id} />}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Title</label>
          <input name='title' defaultValue={webinar.title} required className={inputClass} />
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Date &amp; time (Mountain)</label>
            <input
              type='datetime-local'
              name='startsAt'
              defaultValue={webinar.startsAt}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Sign-up URL</label>
            <input
              type='url'
              name='signUpUrl'
              defaultValue={webinar.signUpUrl}
              placeholder='https://… (leave blank for "Coming soon")'
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
          <textarea name='description' rows={5} defaultValue={webinar.description} required className={inputClass} />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Image</label>
          <div className='flex gap-2'>
            <input
              name='image'
              value={image}
              onChange={(event) => setImage(event.target.value)}
              placeholder='Paste a URL or upload an image'
              className={inputClass}
            />
            <button
              className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 whitespace-nowrap'
              type='button'
              disabled={imageUploading}
              onClick={() => imageInput.current?.click()}
            >
              {imageUploading ? 'Uploading…' : 'Upload'}
            </button>
            <input
              ref={imageInput}
              type='file'
              accept='image/*'
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0]
                event.target.value = ''
                if (file) void uploadImage(file)
              }}
            />
          </div>
          <p className='mt-1 text-xs text-gray-500'>Displayed as a square; a 1:1 image works best.</p>
          {imageError && <p className='mt-1 text-sm text-red-600'>{imageError}</p>}
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className='mt-2 h-48 w-48 object-cover rounded-md border border-gray-200' src={image} alt='' />
          )}
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
            {pending ? 'Saving…' : 'Save webinar'}
          </button>
          <Link
            className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
            href='/admin/webinars'
          >
            Cancel
          </Link>
        </div>
      </form>

      {webinar.id && (
        <form action={deleteWebinar} className='mt-8 bg-white rounded-lg shadow-md p-6 border border-red-200'>
          <input type='hidden' name='id' value={webinar.id} />
          <div className='flex justify-between items-center'>
            <div>
              <h2 className='text-lg font-semibold text-red-600'>Delete webinar</h2>
              <p className='text-sm text-gray-500'>This permanently removes the webinar from the home page.</p>
            </div>
            <button
              className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
              type='submit'
              onClick={(event) => {
                if (!window.confirm('Delete this webinar? This cannot be undone.')) {
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
