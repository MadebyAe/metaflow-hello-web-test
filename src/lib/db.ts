import { Task } from '../types'

const DB_NAME = 'tasks-db'
const DB_VERSION = 1
const STORE_NAME = 'tasks'

let dbInstance: IDBDatabase | null = null

function openDB(): Promise<IDBDatabase> {
  if (dbInstance !== null) {
    return Promise.resolve(dbInstance)
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result
      resolve(dbInstance)
    }

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error)
    }
  })
}

export function getAllTasks(): Promise<Task[]> {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly')
        const store = tx.objectStore(STORE_NAME)
        const request = store.getAll()

        request.onsuccess = (event) => {
          resolve((event.target as IDBRequest<Task[]>).result)
        }

        request.onerror = (event) => {
          reject((event.target as IDBRequest).error)
        }
      }),
  )
}

export function putTask(task: Task): Promise<void> {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        const request = store.put(task)

        request.onsuccess = () => {
          resolve()
        }

        request.onerror = (event) => {
          reject((event.target as IDBRequest).error)
        }
      }),
  )
}

export function removeTask(id: number): Promise<void> {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        const request = store.delete(id)

        request.onsuccess = () => {
          resolve()
        }

        request.onerror = (event) => {
          reject((event.target as IDBRequest).error)
        }
      }),
  )
}

export function removeCompletedTasks(): Promise<void> {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        const request = store.openCursor()
        const errors: DOMException[] = []

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>)
            .result
          if (cursor) {
            const task = cursor.value as Task
            if (task.done) {
              const deleteRequest = cursor.delete()
              deleteRequest.onerror = (e) => {
                errors.push((e.target as IDBRequest).error as DOMException)
              }
            }
            cursor.continue()
          }
        }

        tx.oncomplete = () => {
          if (errors.length > 0) {
            reject(errors[0])
          } else {
            resolve()
          }
        }

        tx.onerror = (event) => {
          reject((event.target as IDBTransaction).error)
        }

        request.onerror = (event) => {
          reject((event.target as IDBRequest).error)
        }
      }),
  )
}

export function _closeDB(): void {
  if (dbInstance !== null) {
    dbInstance.close()
    dbInstance = null
  }
}
