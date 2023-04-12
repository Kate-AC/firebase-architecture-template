import { UserEntity } from 'domain/user'
import { UserRepositoryInterface } from 'domain/user.repository.interface'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { FirebaseRepository } from 'infrastructure/firebase/firebase.repository'

export class UserRepository extends FirebaseRepository implements UserRepositoryInterface {
  async generateDocId(): Promise<string> {
    return doc(this.usersRef()).id
  }

  async save(userEntity: UserEntity): Promise<void> {
    const ref = this.userRef(userEntity.id)
    const storableObject = userEntity.toStorable()

    if (this.intoTransaction()) {
      this.getTransaction().set(ref, storableObject)
      return
    }

    await setDoc(ref, storableObject)
  }

  async find(docId: string): Promise<UserEntity | null> {
    const ref = this.userRef(docId)
    const docSnap = await getDoc(ref)

    if (!docSnap.exists()) return null

    return new UserEntity({
        id: docSnap.id,
        ...docSnap.data()
    })
  }
}
