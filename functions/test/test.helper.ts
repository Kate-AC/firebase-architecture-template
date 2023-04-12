import { UserEntity } from 'domain/user'
import { UserRepository } from 'infrastructure/user.repository'
import { FirebaseTestClient } from './infrastructure/firebase.test.client'

export const defaultUserEntity = (): UserEntity => {
  return new UserEntity({
    id: 'defaultUserEntityId',
    name: 'DefaultUser',
    createdAt: new Date(),
  })
}

export const setup = async (client: FirebaseTestClient) => {
  client = await client.createClient()
  await client.clearFirestore()

  const userRepository = new UserRepository(client)
  const userEntity = defaultUserEntity()
  await userRepository.save(userEntity)
}
