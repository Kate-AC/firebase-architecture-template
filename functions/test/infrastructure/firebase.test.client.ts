import * as firebase from '@firebase/rules-unit-testing'
import { FirebaseApp } from 'firebase/app'
import { Auth, signInWithCustomToken, UserCredential } from 'firebase/auth'
import { Firestore } from 'firebase/firestore'
import { FirebaseStorage } from 'firebase/storage'
import * as admin from 'firebase-admin'
import { FirebaseClientInterface } from 'infrastructure/firebase/firebase.client'

export class FirebaseTestClient implements FirebaseClientInterface {
  app: FirebaseApp
  firestore: Firestore
  auth: Auth
  storage: FirebaseStorage

  private testEnv?: firebase.RulesTestEnvironment = null

  async createClient(): Promise<FirebaseTestClient> {
    const projectId = `test-${Date.now()}`

    // 起動時のemulatorのルールが優先されるため、テスト時は全て通すように上書きする
    this.testEnv = await firebase.initializeTestEnvironment({
      projectId: projectId,
      firestore: {
        host: 'localhost',
        port: 8080,
        rules: `
          rules_version = '2';
          service cloud.firestore {
            match /databases/{database}/documents {
              match /{document=**} {
                allow read, write: if true;
              }
            }
          }
        `,
      },
      storage: {
        host: 'localhost',
        port: 9199,
        rules: `
          rules_version = '2';
          service firebase.storage {
            match /b/{bucket}/o {
              match /{document=**} {
                allow get, create, delete: if true;
              }
            }
          }
        `,
      },
    })

    const unauthenticatedContext = this.testEnv.unauthenticatedContext()
    this.firestore = await unauthenticatedContext.firestore()

    return this
  }

  async clearFirestore(): Promise<void> {
    await this.testEnv?.clearFirestore()
  }

  async generateCustomToken(id: string): Promise<string> {
    return await admin.auth().createCustomToken(id)
  }

  async signIn(jwt: string): Promise<UserCredential> {
    return await signInWithCustomToken(this.auth, jwt)
  }
}
