'use client'

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

 const SettingsPage = () => {
  const { user } = useAuth()
  const router = useRouter()
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // If no user, redirect to home page
  if (!user) return router.push('/')

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password')
      }

      setSuccess('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => {
        setShowPasswordModal(false)
        setSuccess('')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full h-full flex-col'>
      <Nav />
      <div className='pb-10 flex flex-col w-[100vw] items-center'>
        <div className='w-[90vw] max-w-[1200px] mt-8 flex flex-col'>
          <h1 className='text-3xl font-bold mb-8'>Settings</h1>

          {/* Account Information */}
          <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
            <h2 className='text-xl font-semibold mb-4'>Account Information</h2>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                <div className='text-gray-900'>{user.name}</div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                <div className='text-gray-900'>{user.email}</div>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-xl font-semibold mb-4'>Password</h2>
            <button
              onClick={() => setShowPasswordModal(true)}
              className='cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
      <Footer />

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-[90vw] max-w-md'>
            <h2 className='text-2xl font-bold mb-4'>Change Password</h2>
            <form onSubmit={handlePasswordChange}>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Current Password
                  </label>
                  <input
                    type='password'
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    New Password
                  </label>
                  <input
                    type='password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Confirm New Password
                  </label>
                  <input
                    type='password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>

                {error && (
                  <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
                    {error}
                  </div>
                )}

                {success && (
                  <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded'>
                    {success}
                  </div>
                )}

                <div className='flex gap-3 pt-2'>
                  <button
                    type='submit'
                    disabled={loading}
                    className='flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors'
                  >
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setShowPasswordModal(false)
                      setCurrentPassword('')
                      setNewPassword('')
                      setConfirmPassword('')
                      setError('')
                      setSuccess('')
                    }}
                    className='flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
 }

 export default SettingsPage