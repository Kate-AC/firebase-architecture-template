import '../styles/globals.css'

import type { AppProps } from 'next/app'
import { LoadingContextProvider } from 'presenter/contexts/loading.context'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <LoadingContextProvider>
      <Component {...pageProps} />
    </LoadingContextProvider>
  )
}

export default App