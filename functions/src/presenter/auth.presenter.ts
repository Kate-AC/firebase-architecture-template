import { UserEntity } from 'domain/user'
import { UserRepositoryInterface } from 'domain/user.repository.interface'
import { FirebaseClient, FirebaseClientInterface } from 'infrastructure/firebase/firebase.client'
import { UserRepository } from 'infrastructure/user.repository'
import { HandleCookieUsecase, HandleCookieUsecaseInterface } from 'usecase/handle.cookie.usercase'
import Log from 'util/log'

export interface AuthRequest {
  cookies: { [key: string]: string }
}

export interface AuthResponse {
  locals: { id?: string }
  clearCookie: (cookieName: string) => void
  cookie: (cookieName: string, jwt: string, option: object) => void
  redirect(url: string): void
  status(code: number): this
  send(value: string): void
}

export class AuthPresenter {
  constructor(
    private firebaseClient: FirebaseClientInterface = new FirebaseClient,
    private userRepository: UserRepositoryInterface = new UserRepository,
    private handleCookieUsecase: HandleCookieUsecaseInterface = new HandleCookieUsecase
  ) {}

  async login(req: AuthRequest, res: AuthResponse) {
    Log.debug('Call login')
    const id = res.locals.id ?? null
    let userEntity = id ? await this.userRepository.find(id) : null

    if (!userEntity) {
      const docId = await this.userRepository.generateDocId()
      userEntity = new UserEntity({ id: docId, name: 'test', createdAt: new Date })
      await this.userRepository.save(userEntity)
    }

    const jwt = await this.firebaseClient.generateCustomToken(userEntity.id)
    await this.firebaseClient.signIn(jwt)
    await this.handleCookieUsecase.handleCookie(res, req.cookies, jwt)

    res.status(302).send(JSON.stringify({redirectUrl: `${process.env.FRONT_URL}/home`}))
  }
}
