'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  emailOptIn: boolean
  isAdmin: boolean
  createdAt: string
}

const AdminPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/')
      return
    }

    fetchUsers()
  }, [session, status, router])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')

      if (response.status === 403) {
        setError('Access denied - Admin privileges required')
        setIsAdmin(false)
        setLoading(false)
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data = await response.json()
      setUsers(data.users)
      setIsAdmin(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-xl'>Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (!isAdmin) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center'>
          <h1 className='text-2xl font-bold text-red-600 mb-4'>Access Denied</h1>
          <p className='text-gray-600 mb-6'>{error || 'You do not have admin privileges to access this page.'}</p>
          <button
            onClick={() => router.push('/')}
            className='bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition'
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Admin Dashboard</h1>
          <button
            onClick={() => router.push('/')}
            className='cursor-pointer text-blue-600 hover:text-blue-800 transition'
          >
            Back to Site
          </button>
        </div>

        <div className='bg-white rounded-lg shadow-md overflow-hidden'>
          <div className='px-6 py-4 border-b border-gray-200 bg-gray-50'>
            <h2 className='text-xl font-semibold text-gray-800'>
              All Users ({users.length})
            </h2>
          </div>

          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Email
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Phone
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Email Opt-In
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Admin
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {users.map((user) => (
                  <tr key={user.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        {user.firstName} {user.lastName}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-600'>{user.email}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-600'>{user.phoneNumber}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.emailOptIn
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.emailOptIn ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {user.isAdmin && (
                        <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800'>
                          Admin
                        </span>
                      )}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage