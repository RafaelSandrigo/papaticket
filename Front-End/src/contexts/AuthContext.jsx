import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api'

const AuthContext = createContext(null)

function storedUser() {
  const user = localStorage.getItem('user')

  return user ? JSON.parse(user) : null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storedUser)
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('token')))

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      return
    }

    api
      .get('/me')
      .then(({ data }) => saveUser(data.data))
      .finally(() => setLoading(false))
  }, [])

  function saveUser(newUser) {
    localStorage.setItem('user', JSON.stringify(newUser))
    setUser(newUser)
  }

  function saveSession({ token, user: newUser }) {
    localStorage.setItem('token', token)
    saveUser(newUser)

    return newUser
  }

  async function login(email, password) {
    const { data } = await api.post('/login', { email, password })

    return saveSession(data)
  }

  async function register(form) {
    const { data } = await api.post('/register', form)

    return saveSession(data)
  }

  async function logout() {
    try {
      await api.post('/logout')
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
