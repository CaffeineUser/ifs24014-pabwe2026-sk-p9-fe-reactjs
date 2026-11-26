import { useCallback, useEffect, useState } from 'react'

export default function usePath() {
  const [path, setPath] = useState(`${location.pathname}${location.search}`)
  useEffect(() => {
    const onPop = () => setPath(`${location.pathname}${location.search}`)
    addEventListener('popstate', onPop)
    return () => removeEventListener('popstate', onPop)
  }, [])
  const navigate = useCallback((to) => { history.pushState({}, '', to); setPath(`${location.pathname}${location.search}`); scrollTo(0, 0) }, [])
  return [path, navigate]
}
