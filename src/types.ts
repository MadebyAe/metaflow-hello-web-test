export type Priority = 'none' | 'low' | 'medium' | 'high'

export type Filter = 'all' | 'active' | 'completed'

export interface Task {
  id: number
  text: string
  done: boolean
  priority: Priority
}
