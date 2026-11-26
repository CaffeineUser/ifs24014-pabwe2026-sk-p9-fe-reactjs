import { useEffect, useState } from 'react'
import useTheme from './hooks/useTheme'
import usePath from './hooks/usePath'
import { clearSession, getToken, getUser } from './helpers/apiHelper'
import { logoutUser } from './features/auth/api/authApi'
import PublicHome from './features/blog/PublicHome'
import ArticleDetail from './features/blog/ArticleDetail'
import AuthPage from './features/auth/AuthPage'
import AuthorDashboard from './features/author/AuthorDashboard'
import AdminDashboard from './features/admin/AdminDashboard'

export default function App() {
  const [path, navigate] = usePath()
  const { theme, toggleTheme } = useTheme()
  const [user, setUser] = useState(() => (getToken() ? getUser() : null))

  const logout = async () => {
    try {
      await logoutUser()
    } catch {
      // Bersihkan sesi lokal walaupun API sedang tidak dapat dijangkau.
    }

    clearSession()
    setUser(null)
    navigate('/')
  }

  useEffect(() => {
    const handleExpiredSession = () => {
      setUser(null)
      navigate('/login')
    }

    addEventListener('auth:expired', handleExpiredSession)
    return () => removeEventListener('auth:expired', handleExpiredSession)
  }, [navigate])

  const route = path.split('?')[0]
  const isArticleDetail = route.startsWith('/posts/')
  const requiresAuthentication = route === '/author' || route === '/admin'

  useEffect(() => {
    if (requiresAuthentication && !user) {
      navigate('/login')
    } else if (route === '/admin' && user && user.role !== 'admin') {
      navigate('/author')
    }
  }, [requiresAuthentication, route, user, navigate])

  if (route === '/login' || route === '/register') {
    return (
      <AuthPage
        mode={route.slice(1)}
        navigate={navigate}
        onSuccess={(authenticatedUser) => {
          setUser(authenticatedUser)
          navigate(authenticatedUser.role === 'admin' ? '/admin' : '/author')
        }}
      />
    )
  }

  if (route === '/author') {
    return user ? (
      <AuthorDashboard
        user={user}
        navigate={navigate}
        onLogout={logout}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    ) : null
  }

  if (route === '/admin') {
    return user?.role === 'admin' ? (
      <AdminDashboard
        user={user}
        navigate={navigate}
        onLogout={logout}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    ) : null
  }

  if (isArticleDetail) {
    return (
      <ArticleDetail
        path={path}
        navigate={navigate}
        theme={theme}
        toggleTheme={toggleTheme}
        user={user}
        onLogout={logout}
      />
    )
  }

  return (
    <PublicHome
      navigate={navigate}
      user={user}
      onLogout={logout}
      theme={theme}
      toggleTheme={toggleTheme}
    />
  )
}
