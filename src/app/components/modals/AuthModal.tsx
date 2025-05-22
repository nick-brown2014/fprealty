'use client'

import { useAuthContext } from "@/app/contexts/AuthContext"
import { ChangeEvent, useState } from "react"

type SignInForm = {
  email: string
  phone: string
}

const defaultSignInFormData: SignInForm = {
  email: '',
  phone: ''
}

interface SignUpForm extends SignInForm {
  name: string
}

const defaultSignUpFormData: SignUpForm = {
  email: '',
  phone: '',
  name: ''
}

const AuthModal = () => {
  const { modalOpen, setModalOpen } = useAuthContext()
  const [isNewUser, setIsNewUser] = useState<boolean>(true)
  const [signInFormData, setSignInFormData] = useState<SignInForm>(defaultSignInFormData)
  const [signUpFormData, setSignUpFormData] = useState<SignUpForm>(defaultSignUpFormData)
  const [formIsValid, setFormIsValid] = useState<boolean>(false);

  const handleSignUpFormChange = (e: ChangeEvent<HTMLInputElement>, fieldName: 'name' | 'email' | 'phone') => {
    const newVal = e.target.value
    const newFormData = {...signUpFormData}
    newFormData[fieldName] = newVal
    setSignUpFormData(newFormData)
    if (!!signUpFormData.email && signUpFormData.name && signUpFormData.phone) {
      setFormIsValid(true)
    } else {
      setFormIsValid(false)
    }
  }

  const handleSignInFormChange = (e: ChangeEvent<HTMLInputElement>, fieldName: 'email' | 'phone') => {
    const newVal = e.target.value
    const newFormData = {...signInFormData}
    newFormData[fieldName] = newVal
    setSignInFormData(newFormData)
    if (!!signInFormData.email && signInFormData.phone) {
      setFormIsValid(true)
    } else {
      setFormIsValid(false)
    }
  }

  const handleSignIn = () => {
    if (!formIsValid) return
    handleClose()
  }

  const handleSignUp = () => {
    if (!formIsValid) return
    handleClose()
  }

  const renderSignUpForm = () => (
    <>
      <h4 className='text-2xl font-bold tracking-tight text-black'>Create your free account</h4>
      <p className='text-left text-sm'>
        Get instant access to new inventory.
        Save searches and receive email alerts on new homes, price reductions, and status changes.
      </p>
      <form className='w-full flex flex-col gap-1 items-start'>
        <label className='text-sm text-black'>Full name</label>
        <input
          className='px-2 py-1 rounded-md border-gray-500 w-full border-1' 
          name='name'
          placeholder='John Smith'
          value={signUpFormData.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleSignUpFormChange(e, 'name')} />
        <label className='text-sm text-black'>Email</label>
        <input
          className='px-2 py-1 rounded-md border-gray-500 w-full border-1'
          name='email'
          placeholder='johnsmith@gmail.com'
          value={signUpFormData.email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleSignUpFormChange(e, 'email')} />
        <label className='text-sm text-black'>Phone number</label>
        <input
          className='px-2 py-1 rounded-md border-gray-500 w-full border-1'
          name='phone'
          placeholder='(555)-123-4567'
          value={signUpFormData.phone} 
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleSignUpFormChange(e, 'phone')} />
          {!!formIsValid ? (
            <button onClick={handleSignUp} className='self-center mt-4 cursor-pointer shadow-lg rounded px-6 py-[4px] bg-primary text-white font-bold tracking-tight text-xl hover:opacity-70'>
              Create account
            </button>
          ) : (
            <button className='self-center mt-4 cursor-not-allowed shadow-lg rounded px-6 py-[4px] bg-slate-300 text-white font-bold tracking-tight text-xl'>
              Create account
            </button>
          )}
      </form>
    </>
  )

  const renderSignInForm = () => (
    <>
      <h4 className='text-xl font-bold tracking-tight text-black'>Sign in to your account</h4>
      <p className='text-left'>Sign in to access your saved searches and favorite properties</p>
      <form className='w-full flex flex-col gap-1 items-start'>
        <label className='text-sm text-black'>Email</label>
        <input
          className='px-2 py-1 rounded-md border-gray-500 w-full border-1' 
          name='email'
          value={signInFormData.email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleSignInFormChange(e, 'email')} />
        <label className='text-sm text-black'>Phone number</label>
        <input
          className='px-2 py-1 rounded-md border-gray-500 w-full border-1' 
          name='phone'
          value={signInFormData.phone}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleSignInFormChange(e, 'phone')} />
          {!!formIsValid ? (
            <button onClick={handleSignIn} className='self-center mt-4 cursor-pointer shadow-lg rounded px-6 py-[4px] bg-primary text-white font-bold tracking-tight text-xl hover:opacity-70'>
              Sign in
            </button>
          ) : (
            <button className='self-center mt-4 cursor-not-allowed shadow-lg rounded px-6 py-[4px] bg-slate-300 text-white font-bold tracking-tight text-xl'>
              Sign in
            </button>
          )}
      </form>
    </>
  )

  const handleClose = () => {
    setModalOpen(false)
    setSignUpFormData(defaultSignUpFormData)
    setSignInFormData(defaultSignInFormData)
    setFormIsValid(false)
  }

  const handleChangeFormType = () => {
    setIsNewUser(!isNewUser)
    setSignUpFormData(defaultSignUpFormData)
    setSignInFormData(defaultSignInFormData)
    setFormIsValid(false)
  }

  if (!modalOpen) return <></>
  return (
    <>
      <div className="z-20 fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
        <div onClick={handleClose} className="fixed inset-0 z-30 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center text-center sm:items-center sm:p-0">
            <div onClick={(event) => event.stopPropagation()} className="relative transform overflow-hidden py-6 px-10 rounded-lg bg-white flex flex-col gap-4 items-center shadow-xl transition-all w-[450px] max-w-[90vw]">
              <p className='absolute top-2 right-4 font-bold cursor-pointer text-2xl' onClick={handleClose}>x</p>
              {!!isNewUser ? renderSignUpForm() : renderSignInForm()}
              <div className='w-full flex items-center justify-center mt-2 gap-1'>
                {!!isNewUser ? (<>
                  <h4 className='text-lg font-bold tracking-tight text-black'>Have an account?</h4>
                  <h4 className='text-lg font-bold tracking-tight text-secondary cursor-pointer' onClick={handleChangeFormType}>
                    Sign in
                  </h4>
                  </>) : (<>
                    <h4 className='text-lg font-bold tracking-tight text-black'>Dont have an account?</h4>
                    <h4 className='text-lg font-bold tracking-tight text-secondary cursor-pointer' onClick={handleChangeFormType}>
                      Sign up
                    </h4>
                  </>)}
              </div>
            </div>
          </div>
        </div>
    </>
  )

}

export default AuthModal