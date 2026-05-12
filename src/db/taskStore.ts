import { create, insert, remove, search, type Orama, type SearchHits, type SearchOptions } from '@orama/orama'
import { createIndex, saveIndex, loadIndex } from '@orama/plugin-data-persistence'
import { Task } from '../types'

let db: Orama | null = null

export async function initTaskStore() {
  db = await create({
    schema: {
      id: 'number',
      text: 'string',
      done: 'boolean',
      priority: 'string',
    },
    plugins: [
      createIndex({
        key: 'orama-tasks',
        load: loadIndex,
        save: saveIndex,
      }),
    ],
  })

  // Load from localStorage if it exists
  try {
    await loadIndex(db)
  } catch (e) {
    console.error('Failed to load Orama tasks from localStorage:', e)
  }
}

export async function addTask(task: Omit<Task, 'id'>): Promise<Task> {
  if (!db) {
    throw new Error('Task store not initialized')
  }
  
  const newTask = {
    ...task,
    id: Date.now() + Math.random(), // Simple unique ID generation
  }
  
  await insert(db, newTask)
  await saveIndex(db) // Persist after write
  return newTask
}

export async function removeTask(id: number): Promise<void> {
  if (!db) {
    throw new Error('Task store not initialized')
  }
  
  await remove(db, { id })
  await saveIndex(db) // Persist after write
}

export async function updateTask(id: number, updates: Partial<Omit<Task, 'id'>>): Promise<void> {
  if (!db) {
    throw new Error('Task store not initialized')
  }
  
  // First get the task
  const { hits } = await search(db, {
    term: id.toString(),
    properties: ['id']
  })
  
  if (hits.length === 0) {
    throw new Error(`Task with id ${id} not found`)
  }
  
  const existing = hits[0].document
  const updatedTask = { ...existing, ...updates }
  
  // Remove the old document
  await remove(db, { id })
  // Insert updated document
  await insert(db, updatedTask)
  await saveIndex(db) // Persist after write
}

export async function getAllTasks(): Promise<Task[]> {
  if (!db) {
    throw new Error('Task store not initialized')
  }
  
  const { hits } = await search(db, {
    term: '',
    limit: 1000,
  })
  
  return hits.map(hit => hit.document)
}

export async function searchTasks(query: string): Promise<Task[]> {
  if (!db) {
    throw new Error('Task store not initialized')
  }
  
  const { hits } = await search(db, {
    term: query,
    properties: ['text'],
  })
  
  return hits.map(hit => hit.document)
}
