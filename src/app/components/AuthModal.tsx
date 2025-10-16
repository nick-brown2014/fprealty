'use client'

import { useEffect, useState } from 'react'
import { signIn as nextAuthSignIn } from 'next-auth/react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [emailOptIn, setEmailOptIn] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Clear form when changing between Sign In and Sign Up
  useEffect(() => {
    setEmail('')
    setPassword('')
    setFirstName('')
    setLastName('')
    setPhoneNumber('')
    setEmailOptIn(false)
    setShowPassword(false)
    setError('')
    setSuccess('')

  }, [isSignUp])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isSignUp) {
        // Sign up - create new user
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password, firstName, lastName, phoneNumber, emailOptIn })
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Something went wrong')
          return
        }

        setSuccess(data.message)

        // Auto sign in after signup using NextAuth
        const signInResult = await nextAuthSignIn('credentials', {
          email,
          password,
          redirect: false
        })

        if (signInResult?.error) {
          setError('Account created but sign in failed. Please try signing in.')
          return
        }

        // Reload page after successful sign in
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        // Sign in using NextAuth
        const result = await nextAuthSignIn('credentials', {
          email,
          password,
          redirect: false,
          callbackUrl: '/'
        })

        if (result?.error || !result?.ok) {
          setError('Invalid email or password')
          return
        }

        setSuccess('Signed in successfully')

        setEmail('')
        setPassword('')

        // Reload page after successful sign in
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Auth error:', err)
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
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                placeholder='Enter your password'
                required
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' />
                  </svg>
                ) : (
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div className='flex items-start'>
              <input
                type='checkbox'
                id='emailOptIn'
                checked={emailOptIn}
                onChange={(e) => setEmailOptIn(e.target.checked)}
                className='mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer'
              />
              <label htmlFor='emailOptIn' className='ml-3 text-xs text-gray-600'>
                I agree to be contacted by Fred Porter via call, email, and text for real estate services. To opt out, you can reply &apos;stop&apos; at any time or reply &apos;help&apos; for assistance. You can also click the unsubscribe link in the emails. Message and data rates may apply. Message frequency may vary.
              </label>
            </div>
          )}

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