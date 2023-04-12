import { useRouter } from 'next/router'
import { createContext,useContext, useEffect,useState  } from 'react'

const initLoading = {
  loading: false,
  setLoading: (_: boolean) => {},
}

const LoadingContext = createContext(initLoading)

export const LoadingContextProvider = (props: { children: React.ReactElement }) => {
  const [loading, setLoading] = useState(false)
  const loadingState = { loading, setLoading }
  const router = useRouter()

  const handleRouteChange = () => {
    setLoading(false)
  }

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <LoadingContext.Provider value={loadingState}>
      {props.children}
    </LoadingContext.Provider>
  )
}

export const useLoadingState = () => useContext(LoadingContext)
