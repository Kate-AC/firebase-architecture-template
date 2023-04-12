import { ApiClient, ApiRequestInterface } from 'infrastructure/api.client'
import { useRouter } from 'next/router'
import useSWR from 'swr'

const fetcher = async (request: ApiRequestInterface): Promise<any> => {
  const client = new ApiClient
  return await client.request(request)
    .then(response => {
      //Promise.resolve(response.data)
      return response.data
    })
}

export const useCallApi = (request: ApiRequestInterface) => {
  const router = useRouter()
  const url = request.getUrl()

  return useSWR(
    router.isReady ? url : null,
    () => fetcher(request),
    {
      errorRetryInterval: 3000
    }
  )
}
