import { HomeRequest } from 'infrastructure/api.requests'
import { Loading } from 'presenter/components/loading'
import { useCallApi } from 'presenter/hooks/use.call.api'
import { Suspense } from 'react'

export const Layout = () => {
  const { data } = useCallApi(new HomeRequest({hogeId: 'hoge'}))

  return data ? (
    <div>{data.name}</div>
  ) : (
    <Loading />
  )
}

export const HomePage = () => {
  return (
    <>
      <h1>Home</h1>
      <Suspense fallback={<>Loading...</>}>
        <Layout />
      </Suspense>
    </>
  )
}
