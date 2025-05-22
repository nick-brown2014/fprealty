"use client"

import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react"
import { AuthUser, SimpleUser } from '../types/AuthTypes'
import useCookie from '../hooks/useCookies'

interface TAuthContext {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
  userInfo: SimpleUser | null
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>
}

const AuthContext = createContext<TAuthContext>({
  user: null,
  setUser: () => {},
  userInfo: null,
  modalOpen: false,
  setModalOpen: () => false,
})

interface Props {
  children: ReactNode
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [userInfo, setUserInfo] = useState<SimpleUser | null>(null)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const { getCookie } = useCookie()

  useEffect(() => {
    if (!user) {
      let existingUser = null
      const getFromCookie = async () => (existingUser = getCookie("user"))
      getFromCookie()

      if (existingUser) {
        try {
          setUser(JSON.parse(existingUser))
          // TODO: Set User Info to useful object
          setUserInfo(null)
        } catch (e) {
          console.log(e)
        }
      }
    }
  }, [getCookie, user])

  return (
    <AuthContext.Provider value={{ user, setUser, modalOpen, setModalOpen, userInfo }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthContext not properly defined!');
  return context;
};