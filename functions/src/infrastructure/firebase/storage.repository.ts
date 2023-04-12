import { deleteObject, getBytes, UploadResult, uploadString } from 'firebase/storage'
import { FirebaseRepository } from 'infrastructure/firebase/firebase.repository'

export interface StorageRepositoryInterface {
  saveContent(contentId: string, dataURL: string): Promise<UploadResult>
  fetchContent(contentId: string): Promise<ArrayBuffer>
  deleteContent(contentId: string): Promise<void>
}

export class StorageRepository extends FirebaseRepository implements StorageRepositoryInterface {
  async saveContent(contentId: string, dataURL: string): Promise<UploadResult> {
    const storageRef = this.storageContentRef(contentId)
    return await uploadString(storageRef, dataURL, 'data_url')
  }

  async fetchContent(contentId: string): Promise<ArrayBuffer> {
    const storageRef = this.storageContentRef(contentId)
    return await getBytes(storageRef)
  }

  async deleteContent(contentId: string): Promise<void> {
    const storageRef = this.storageContentRef(contentId)
    return await deleteObject(storageRef)
  }
}
