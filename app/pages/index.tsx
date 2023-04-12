import { useRouter } from 'next/router'
import { TopPage } from 'presenter/pages/top.page'
import { useEffect } from 'react'

const Top = () => {
  const router = useRouter()
  useEffect(() => {
    if (!router.isReady) {
      return
    }
    if (location.pathname !== '/') {
      router.push(location.pathname)
    }
  }, [router])

  return <TopPage />
}

export default Top
