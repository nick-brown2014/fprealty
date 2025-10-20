'use client'

import { useState } from 'react'
import Nav from '../components/Nav'
import { Metadata } from 'next'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      setSuccess(true)
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Forgot password error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full h-screen flex flex-col'>
      <Nav />
      <div className='flex-1 flex items-center justify-center bg-gray-50 px-4'>
        <div className='max-w-md w-full bg-white shadow-lg rounded-lg p-8'>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>Forgot Password?</h1>
          <p className='text-sm text-gray-600 mb-6'>
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {success ? (
            <div className='bg-green-50 border border-green-200 rounded-md p-4'>
              <p className='text-sm text-green-800'>
                Check your email! We've sent you a password reset link. It will expire in 1 hour.
              </p>
              <a
                href='/'
                className='mt-4 inline-block text-sm text-primary hover:underline'
              >
                Return to home
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-4'>
              {error && (
                <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
                  <p className='text-sm text-red-600'>{error}</p>
                </div>
              )}

              <div>
                <label htmlFor='email' className='block text-sm font-semibold text-gray-700 mb-2'>
                  Email Address
                </label>
                <input
                  type='email'
                  id='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                  placeholder='you@example.com'
                  required
                />
              </div>

              <button
                type='submit'
                disabled={loading}
                className='w-full bg-primary text-white py-2 px-4 rounded-md hover:opacity-90 transition font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <div className='text-center'>
                <a
                  href='/'
                  className='text-sm text-gray-600 hover:text-primary'
                >
                  Back to sign in
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage