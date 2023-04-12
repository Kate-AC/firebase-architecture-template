import { FirebaseApp, initializeApp } from 'firebase/app'
import {
  Auth,
  connectAuthEmulator,
  getAuth,
  signInWithCustomToken,
  UserCredential,
} from 'firebase/auth'
import {
  connectFirestoreEmulator,
  Firestore,
  getFirestore,
} from 'firebase/firestore'
import {
  connectStorageEmulator,
  FirebaseStorage,
  getStorage,
} from 'firebase/storage'
import * as admin from 'firebase-admin'

export interface FirebaseClientInterface {
  app: FirebaseApp
  firestore: Firestore
  auth: Auth
  storage: FirebaseStorage

  generateCustomToken(id: string): Promise<string>
  signIn(jwt: string): Promise<UserCredential>
}

export class FirebaseClient implements FirebaseClientInterface {
  readonly app: FirebaseApp
  readonly firestore: Firestore
  readonly auth: Auth
  readonly storage: FirebaseStorage

  private static isEmulatorStarted = false
  static readonly firebaseConfig = {
    apiKey: process.env.FB_API_KEY,
    appId: process.env.FB_APP_ID,
    authDomain: process.env.FB_AUTH_DOMAIN,
    databaseURL: process.env.FB_DATABASE_URL,
    projectId: process.env.FB_PROJECT_ID,
    storageBucket: process.env.FB_STORAGE_BUCKET,
    messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
  }

  constructor(props = FirebaseClient.firebaseConfig) {
    if (!process.env.APP_ENV) {
      return
    }

    this.app = initializeApp(props)
    this.firestore = getFirestore(this.app)
    this.auth = getAuth(this.app)
    this.storage = getStorage(this.app, process.env.FIREBASE_STORAGE_BUCKET)

    if (!FirebaseClient.isEmulatorStarted && process.env.APP_ENV === 'local') {
      connectFirestoreEmulator(this.firestore, 'localhost', 8080)
      connectStorageEmulator(this.storage, 'localhost', 9199)
      connectAuthEmulator(this.auth, 'http://firebase:9099', { disableWarnings: true })

      FirebaseClient.isEmulatorStarted = true
    }
  }

  async generateCustomToken(id: string): Promise<string> {
    return await admin.auth().createCustomToken(id)
  }

  async signIn(jwt: string): Promise<UserCredential> {
    return await signInWithCustomToken(this.auth, jwt)
  }
}
