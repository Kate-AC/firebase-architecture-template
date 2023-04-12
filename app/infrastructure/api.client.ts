import axios from 'axios'

export enum MethodType {
  GET = 'GET',
  POST = 'POST'
}

export interface ApiRequestInterface {
  getMethod: () => MethodType
  getUrl: () => string
}

export class ApiResponse {
  status: number
  data: any

  constructor(status: number, data: any) {
    this.status = status
    this.data = data
  }
}

export class ApiClient {
  async request<T extends ApiRequestInterface>(request: T): Promise<ApiResponse> {
    return axios.request({
      method: request.getMethod(),
      url: request.getUrl(),
      params: request,
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
      .then(response => {
        return new ApiResponse(response.status, response.data)
      })
      .catch(error => {
        const { response } = error

        if (response?.status === 404) {
          window.location.href = '/404'
        }

        if (response?.status === 301 || response?.status === 302) {
          window.location.href = response.data?.redirectUrl ?? '/'
        }

        return new ApiResponse(response.status, response.data)
      })
  }
}
