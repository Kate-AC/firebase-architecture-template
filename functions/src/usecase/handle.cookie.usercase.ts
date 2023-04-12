interface HandleCookieResponse {
  clearCookie: (cookieName: string) => void
  cookie: (cookieName: string, jwt: string, option: object) => void
}

type Cookies = { [key: string]: string }

export interface HandleCookieUsecaseInterface {
  handleCookie(response: HandleCookieResponse, cookies: Cookies, jwt: string): Promise<void>
}

export class HandleCookieUsecase implements HandleCookieUsecaseInterface {
  async handleCookie(response: HandleCookieResponse, cookies: Cookies, jwt: string): Promise<void> {
    await Promise.all(
      Object.keys(cookies).map(async cookieName => {
        response.clearCookie(cookieName)
      })
    )
    const cookieName = `__session__${Date.now()}`

    response.cookie(cookieName, jwt, {
      maxAge: new Date().getTime() + 1000 * 60 * 60 * 24 * 1,
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      path: '/',
    })
  }
}
