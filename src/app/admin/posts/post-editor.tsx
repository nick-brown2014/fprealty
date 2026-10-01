'use client'

import { useEditor, useEditorState, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { useRef, useState } from 'react'
import { uploadPostImage } from '../actions'

type Props = {
  name: string
  initialContent: string
}

export default function PostEditor({ name, initialContent }: Props) {
  const [html, setHtml] = useState(initialContent)
  const [uploadError, setUploadError] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        codeBlock: false,
        code: false,
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: 'https',
          HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
        },
      }),
      Image.configure({ inline: false }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          'prose max-w-none min-h-48 px-3 py-2 focus:outline-none [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3 [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:text-primary [&_a]:underline',
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.isEmpty ? '' : editor.getHTML()),
  })

  const active = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor?.isActive('bold') ?? false,
      italic: editor?.isActive('italic') ?? false,
      h2: editor?.isActive('heading', { level: 2 }) ?? false,
      h3: editor?.isActive('heading', { level: 3 }) ?? false,
      bulletList: editor?.isActive('bulletList') ?? false,
      orderedList: editor?.isActive('orderedList') ?? false,
      blockquote: editor?.isActive('blockquote') ?? false,
      link: editor?.isActive('link') ?? false,
    }),
  }) ?? {
    bold: false,
    italic: false,
    h2: false,
    h3: false,
    bulletList: false,
    orderedList: false,
    blockquote: false,
    link: false,
  }

  async function insertImage(file: File) {
    if (!editor) return
    setUploading(true)
    setUploadError('')
    const formData = new FormData()
    formData.set('image', file)
    const result = await uploadPostImage(formData)
    setUploading(false)
    if ('error' in result) {
      setUploadError(result.error)
      return
    }
    editor
      .chain()
      .focus()
      .setImage({ src: result.url, alt: file.name.replace(/\.[^.]+$/, '') })
      .run()
  }

  function setLink() {
    if (!editor) return
    const previous = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Link URL', previous ?? 'https://')
    if (url === null) return
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
  }

  const button = (label: string, onClick: () => void, active = false, title = label) => (
    <button
      type='button'
      className={`px-2 py-1 text-sm rounded border ${
        active
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
      } disabled:opacity-50`}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      title={title}
      disabled={!editor}
    >
      {label}
    </button>
  )

  return (
    <div className='border border-gray-300 rounded-md'>
      <input type='hidden' name={name} value={html} />
      <div className='flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50' role='toolbar' aria-label='Formatting'>
        {button('B', () => editor?.chain().focus().toggleBold().run(), active.bold, 'Bold')}
        {button('I', () => editor?.chain().focus().toggleItalic().run(), active.italic, 'Italic')}
        {button('H2', () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active.h2, 'Heading')}
        {button('H3', () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), active.h3, 'Subheading')}
        {button('• List', () => editor?.chain().focus().toggleBulletList().run(), active.bulletList, 'Bulleted list')}
        {button('1. List', () => editor?.chain().focus().toggleOrderedList().run(), active.orderedList, 'Numbered list')}
        {button('Quote', () => editor?.chain().focus().toggleBlockquote().run(), active.blockquote, 'Blockquote')}
        {button('Link', setLink, active.link)}
        {button(uploading ? 'Uploading…' : 'Image', () => fileInput.current?.click(), false, 'Insert image')}
        <input
          ref={fileInput}
          type='file'
          accept='image/*'
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ''
            if (file) void insertImage(file)
          }}
        />
      </div>
      <EditorContent editor={editor} />
      {uploadError && <p className='p-2 text-sm text-red-600'>{uploadError}</p>}
    </div>
  )
}
