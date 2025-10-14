'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { signIn } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/signin'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          isSignUp
            ? { email, password, firstName, lastName, phoneNumber }
            : { email, password }
        )
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      setSuccess(data.message)

      // Save user data to context
      signIn(data.user)

      setEmail('')
      setPassword('')
      setFirstName('')
      setLastName('')
      setPhoneNumber('')

      // Close modal after successful auth
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className='fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center'
      onClick={onClose}
    >
      <div
        className='max-w-[600px] max-h-[80vh] w-[90vw] rounded-2xl bg-white shadow-xl p-8 relative overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer'
          aria-label='Close modal'
        >
          <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        </button>

        <h2 className='text-2xl font-bold text-gray-900 mb-6'>
          {isSignUp ? 'Sign up' : 'Sign in'}
        </h2>

        {error && (
          <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md'>
            <p className='text-sm text-red-600'>{error}</p>
          </div>
        )}

        {success && (
          <div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-md'>
            <p className='text-sm text-green-600'>{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          {isSignUp && (
            <>
              <div>
                <label htmlFor='firstName' className='block text-sm font-semibold text-gray-700 mb-2'>
                  First Name
                </label>
                <input
                  type='text'
                  id='firstName'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                  placeholder='Enter your first name'
                  required
                />
              </div>

              <div>
                <label htmlFor='lastName' className='block text-sm font-semibold text-gray-700 mb-2'>
                  Last Name
                </label>
                <input
                  type='text'
                  id='lastName'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                  placeholder='Enter your last name'
                  required
                />
              </div>

              <div>
                <label htmlFor='phoneNumber' className='block text-sm font-semibold text-gray-700 mb-2'>
                  Phone Number
                </label>
                <input
                  type='tel'
                  id='phoneNumber'
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                  placeholder='Enter your phone number'
                  required
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor='email' className='block text-sm font-semibold text-gray-700 mb-2'>
              Email
            </label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
              placeholder='Enter your email'
              required
            />
          </div>

          <div>
            <label htmlFor='password' className='block text-sm font-semibold text-gray-700 mb-2'>
              Password
            </label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
              placeholder='Enter your password'
              required
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-primary text-white py-2 px-4 rounded-md hover:opacity-90 transition font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign up' : 'Sign in'}
          </button>
        </form>

        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-600'>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className='ml-2 text-primary font-semibold hover:underline cursor-pointer'
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthModal