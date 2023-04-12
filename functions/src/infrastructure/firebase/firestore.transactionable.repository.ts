import { runTransaction, Transaction } from 'firebase/firestore'
import { FirebaseClient, FirebaseClientInterface } from './firebase.client'

// transaction?は、特定のrepository等でトランザクションが実行できない場合（実装されていない場合も含む）に
// その場で利用するための引数
type TransactionExecutor<U> = (transaction?: Transaction) => Promise<U>

export interface FirestoreTransactionableRepositoryInterface {
  intoTransaction(): boolean
  getTransaction(): Transaction
  beginTransaction<T>(executor: TransactionExecutor<T>): Promise<T>
}

// prettier-ignore
export class FirestoreTransactionableRepository
implements FirestoreTransactionableRepositoryInterface {
  static transaction: Transaction = null

  constructor(readonly firebaseClient: FirebaseClientInterface = new FirebaseClient()) {}

  intoTransaction(): boolean {
    return FirestoreTransactionableRepository.transaction !== null
  }

  getTransaction(): Transaction {
    return FirestoreTransactionableRepository.transaction
  }

  async beginTransaction<T = void>(executor: TransactionExecutor<T>): Promise<T> {
    return await runTransaction<T>(this.firebaseClient.firestore, async transaction => {
      FirestoreTransactionableRepository.transaction = transaction
      const result = await executor(transaction)
      FirestoreTransactionableRepository.transaction = null

      return result
    })
  }
}
