import { Task } from '../../types'
import { TaskItem } from '../task-item/task-item'

interface TaskListProps {
  tasks: Task[]
  totalTasksCount: number
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onCyclePriority: (id: number) => void
}

export function TaskList({
  tasks,
  totalTasksCount,
  onToggle,
  onDelete,
  onCyclePriority,
}: TaskListProps) {
  const renderContent = () => {
    if (totalTasksCount === 0) {
      return <li className="empty-state">No tasks yet — add one above</li>
    }
    if (tasks.length === 0) {
      return <li className="empty-state">No tasks match this filter</li>
    }
    return tasks.map((task) => (
      <TaskItem
        key={task.id}
        task={task}
        onToggle={onToggle}
        onDelete={onDelete}
        onCyclePriority={onCyclePriority}
      />
    ))
  }

  return <ul id="task-list">{renderContent()}</ul>
}