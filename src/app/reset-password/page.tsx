'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Nav from '../components/Nav'
import Link from 'next/link'

const ResetPasswordPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link')
    }
  }, [token])

  const validatePassword = (value: string) => {
    if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return false
    }
    if (!/(?=.*[a-z])/.test(value)) {
      setPasswordError('Password must contain at least one lowercase letter')
      return false
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      setPasswordError('Password must contain at least one uppercase letter')
      return false
    }
    if (!/(?=.*\d)/.test(value)) {
      setPasswordError('Password must contain at least one number')
      return false
    }
    setPasswordError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!validatePassword(password)) {
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, password })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      setSuccess(true)

      // Redirect to home after 3 seconds
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Reset password error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className='w-full h-screen flex flex-col'>
        <Nav />
        <div className='flex-1 flex items-center justify-center bg-gray-50 px-4'>
          <div className='max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center'>
            <h1 className='text-2xl font-bold text-gray-900 mb-4'>Invalid Reset Link</h1>
            <p className='text-gray-600 mb-6'>
              This password reset link is invalid or has expired.
            </p>
            <Link
              href='/forgot-password'
              className='inline-block bg-primary text-white py-2 px-4 rounded-md hover:opacity-90 transition'
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full h-screen flex flex-col'>
      <Nav />
      <div className='flex-1 flex items-center justify-center bg-gray-50 px-4'>
        <div className='max-w-md w-full bg-white shadow-lg rounded-lg p-8'>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>Reset Your Password</h1>
          <p className='text-sm text-gray-600 mb-6'>
            Enter your new password below.
          </p>

          {success ? (
            <div className='bg-green-50 border border-green-200 rounded-md p-4'>
              <p className='text-sm text-green-800 mb-2'>
                Your password has been reset successfully!
              </p>
              <p className='text-sm text-green-700'>
                Redirecting you to the homepage...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-4'>
              {error && (
                <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
                  <p className='text-sm text-red-600'>{error}</p>
                </div>
              )}

              <div>
                <label htmlFor='password' className='block text-sm font-semibold text-gray-700 mb-2'>
                  New Password <span className='text-xs text-gray-500'>(min. 8 chars, 1 uppercase, 1 lowercase, 1 number)</span>
                </label>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      validatePassword(e.target.value)
                    }}
                    className={`w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 ${
                      passwordError
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-primary'
                    }`}
                    placeholder='Enter your new password'
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
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
                {passwordError && (
                  <p className='mt-1 text-sm text-red-600'>{passwordError}</p>
                )}
              </div>

              <div>
                <label htmlFor='confirmPassword' className='block text-sm font-semibold text-gray-700 mb-2'>
                  Confirm New Password
                </label>
                <input
                  type='password'
                  id='confirmPassword'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                  placeholder='Confirm your new password'
                  required
                />
              </div>

              <button
                type='submit'
                disabled={loading}
                className='w-full bg-primary text-white py-2 px-4 rounded-md hover:opacity-90 transition font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPasswordPage