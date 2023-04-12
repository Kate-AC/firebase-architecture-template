import { UserRepositoryInterface } from 'domain/user.repository.interface'
import { UserRepository } from 'infrastructure/user.repository'
import Log from 'util/log'

export interface HomeRequest {}

export interface HomeResponse {
  locals: { id?: string }
  status(code: number): this
  send(value: string): void
}

export class HomePresenter {
  constructor(
    private userRepository: UserRepositoryInterface = new UserRepository,
  ) {}

  async home(_req: HomeRequest, res: HomeResponse) {
    Log.debug('Call home', res.locals.id)
    const user = await this.userRepository.find(res.locals.id)
    res.status(200).send(JSON.stringify(user))
  }
}
