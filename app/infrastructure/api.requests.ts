import { ApiRequestInterface, MethodType } from "infrastructure/api.client";

type RequestProps<T> = Omit<Readonly<T>, 'getMethod' | 'getUrl'>

export class AuthRequest implements ApiRequestInterface {
  getMethod() { return MethodType.POST }
  getUrl() { return `${process.env.NEXT_PUBLIC_FUNCTIONS_PATH}/auth/login` }
}

export class HomeRequest implements ApiRequestInterface {
  readonly hogeId: string

  constructor(props: RequestProps<HomeRequest>) {
    this.hogeId = props.hogeId
  }

  getMethod() { return MethodType.POST }
  getUrl() { return `${process.env.NEXT_PUBLIC_FUNCTIONS_PATH}/home/` }
}
