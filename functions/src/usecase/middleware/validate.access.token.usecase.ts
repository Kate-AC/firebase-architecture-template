import { FirebaseClient, FirebaseClientInterface } from 'infrastructure/firebase/firebase.client'

export interface ValidateAccessTokenUsecaseInterface {
  validateAccessToken(cookies: { [key: string]: string }): Promise<string>
}

export class AccessTokenVerificationError extends Error {}
export class NoCookieError extends Error {}

export class ValidateAccessTokenUsecase implements ValidateAccessTokenUsecaseInterface {
  constructor(private readonly firebaseClient: FirebaseClientInterface = new FirebaseClient()) {}

  async validateAccessToken(cookies: { [key: string]: string }): Promise<string> {
    const cookieNames = Object.keys(cookies)
    if (cookieNames.length < 1) {
      throw new NoCookieError()
    }

    const cookieName = cookieNames.find(cookieName => cookieName.includes('__session__')) ?? null
    if (cookieName === null) {
      throw new NoCookieError()
    }

    const accessToken = cookies[cookieName]
    const userCredential = await this.firebaseClient.signIn(accessToken)

    const user = userCredential.user
    const tokenExp = (await user.getIdTokenResult()).expirationTime

    const now = Date.now() / 1000
    if (tokenExp && parseInt(tokenExp) < now) {
      throw new AccessTokenVerificationError()
    }

    return user.uid
  }
}
