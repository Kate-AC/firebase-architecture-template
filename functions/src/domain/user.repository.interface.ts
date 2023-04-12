import { UserEntity } from 'domain/user'

export interface UserRepositoryInterface {
  generateDocId(): Promise<string>
  save(userEntity: UserEntity): Promise<void>
  find(docId: string): Promise<UserEntity | null>
}