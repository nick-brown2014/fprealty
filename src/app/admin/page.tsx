'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut, signIn } from 'next-auth/react'
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

interface UserFormData {
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  password: string
  emailOptIn: boolean
  isAdmin: boolean
}

const AdminPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    password: '',
    emailOptIn: false,
    isAdmin: false
  })
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null)
  const [deleteConfirmName, setDeleteConfirmName] = useState('')
  const [deleteError, setDeleteError] = useState('')

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

  const openCreateModal = () => {
    setModalMode('create')
    setSelectedUser(null)
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      password: '',
      emailOptIn: false,
      isAdmin: false
    })
    setFormError('')
    setShowModal(true)
  }

  const openEditModal = (user: AdminUser) => {
    setModalMode('edit')
    setSelectedUser(user)
    setFormData({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      password: '',
      emailOptIn: user.emailOptIn,
      isAdmin: user.isAdmin
    })
    setFormError('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedUser(null)
    setFormError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setFormLoading(true)

    try {
      if (modalMode === 'create') {
        // Create new user
        const response = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to create user')
        }
      } else if (modalMode === 'edit' && selectedUser) {
        // Update existing user
        const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to update user')
        }
      }

      // Refresh users list
      await fetchUsers()
      closeModal()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setFormLoading(false)
    }
  }

  const openDeleteModal = (user: AdminUser) => {
    setUserToDelete(user)
    setDeleteConfirmName('')
    setDeleteError('')
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setUserToDelete(null)
    setDeleteConfirmName('')
    setDeleteError('')
  }

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return

    const expectedName = `${userToDelete.firstName} ${userToDelete.lastName}`

    if (deleteConfirmName !== expectedName) {
      setDeleteError(`Please type "${expectedName}" exactly to confirm deletion`)
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete user')
      }

      // Refresh users list and close modal
      await fetchUsers()
      closeDeleteModal()
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete user')
    }
  }

  const handleImpersonate = async (user: AdminUser) => {
    if (!confirm(`Log in as ${user.firstName} ${user.lastName}?`)) {
      return
    }

    try {
      // Sign out current session
      await signOut({ redirect: false })

      // Sign in as the target user using impersonation
      const result = await signIn('credentials', {
        impersonateUserId: user.id,
        redirect: false
      })

      if (result?.ok) {
        // Redirect to home page
        router.push('/')
      } else {
        alert('Failed to log in as user')
      }
    } catch (err) {
      console.error('Impersonation error:', err)
      alert('Failed to log in as user')
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
          <div className='flex gap-4'>
            <button
              onClick={openCreateModal}
              className='cursor-pointer bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition'
            >
              Create New User
            </button>
            <button
              onClick={() => router.push('/')}
              className='cursor-pointer text-blue-600 hover:text-blue-800 transition'
            >
              Back to Site
            </button>
          </div>
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
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
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
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <button
                        onClick={() => handleImpersonate(user)}
                        className='cursor-pointer text-purple-600 hover:text-purple-900 mr-4'
                        title='Log in as this user'
                      >
                        Log In as User
                      </button>
                      <button
                        onClick={() => openEditModal(user)}
                        className='cursor-pointer text-blue-600 hover:text-blue-900 mr-4'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(user)}
                        className='cursor-pointer text-red-600 hover:text-red-900'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit User Modal */}
      {showModal && (
        <div
          className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4'
          onClick={closeModal}
        >
          <div
            className='bg-white rounded-lg shadow-xl max-w-md w-full p-6'
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              {modalMode === 'create' ? 'Create New User' : 'Edit User'}
            </h2>

            {formError && (
              <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Email
                </label>
                <input
                  type='email'
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    First Name
                  </label>
                  <input
                    type='text'
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Last Name
                  </label>
                  <input
                    type='text'
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Phone Number
                </label>
                <input
                  type='tel'
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Password {modalMode === 'edit' && '(leave blank to keep current)'}
                </label>
                <input
                  type='password'
                  required={modalMode === 'create'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='emailOptIn'
                  checked={formData.emailOptIn}
                  onChange={(e) => setFormData({ ...formData, emailOptIn: e.target.checked })}
                  className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer'
                />
                <label htmlFor='emailOptIn' className='ml-2 block text-sm text-gray-700 cursor-pointer'>
                  Email Opt-In
                </label>
              </div>

              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='isAdmin'
                  checked={formData.isAdmin}
                  onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                  className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer'
                />
                <label htmlFor='isAdmin' className='ml-2 block text-sm text-gray-700 cursor-pointer'>
                  Admin Privileges
                </label>
              </div>

              <div className='flex justify-end gap-3 pt-4'>
                <button
                  type='button'
                  onClick={closeModal}
                  className='cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50'
                  disabled={formLoading}
                >
                  {formLoading ? 'Saving...' : modalMode === 'create' ? 'Create User' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div
          className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4'
          onClick={closeDeleteModal}
        >
          <div
            className='bg-white rounded-lg shadow-xl max-w-md w-full p-6'
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className='text-2xl font-bold text-red-600 mb-4'>Delete User</h2>

            <p className='text-gray-700 mb-4'>
              Are you sure you want to delete <strong>{userToDelete.firstName} {userToDelete.lastName}</strong>?
              This action cannot be undone.
            </p>

            <p className='text-gray-700 mb-4'>
              To confirm, please type the user&apos;s full name exactly:
            </p>

            <p className='text-sm font-mono bg-gray-100 p-2 rounded mb-4 text-center'>
              {userToDelete.firstName} {userToDelete.lastName}
            </p>

            {deleteError && (
              <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm'>
                {deleteError}
              </div>
            )}

            <input
              type='text'
              value={deleteConfirmName}
              onChange={(e) => setDeleteConfirmName(e.target.value)}
              placeholder='Type full name here'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 mb-4'
              autoFocus
            />

            <div className='flex justify-end gap-3'>
              <button
                type='button'
                onClick={closeDeleteModal}
                className='cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className='cursor-pointer px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPage