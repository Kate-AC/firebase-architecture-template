import { FirebaseClient, FirebaseClientInterface } from 'infrastructure/firebase/firebase.client'
import { collection, CollectionReference, doc, DocumentReference, Firestore } from "firebase/firestore";
import {
  FirestoreTransactionableRepository,
  FirestoreTransactionableRepositoryInterface,
} from 'infrastructure/firebase/firestore.transactionable.repository'
import { ref, StorageReference } from 'firebase/storage';

export interface FirebaseRepositoryInterface extends FirestoreTransactionableRepositoryInterface {
  getFirestore(): Firestore
  userRef(docId: string): DocumentReference
  usersRef(): CollectionReference
  storageContentRef(id: string): StorageReference
}

// prettier-ignore
export class FirebaseRepository
  extends FirestoreTransactionableRepository
  implements FirebaseRepositoryInterface {
  constructor(readonly firebaseClient: FirebaseClientInterface = new FirebaseClient()) {
    super(firebaseClient)
  }

  getFirestore(): Firestore {
    return this.firebaseClient.firestore
  }

  userRef(docId: string): DocumentReference {
    return doc(this.usersRef(), docId)
  }

  usersRef(): CollectionReference {
    return collection(this.getFirestore(), 'users')
  }

  storageContentRef(docId: string): StorageReference {
    return ref(this.firebaseClient.storage, `content/${docId}`)
  }
}
