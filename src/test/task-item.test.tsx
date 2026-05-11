import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskItem } from '../components/task-item/task-item'
import { Task } from '../types'

const baseTask: Task = {
  id: 1,
  text: 'Test task',
  done: false,
  priority: 'none',
}

describe('TaskItem', () => {
  it('renders task text', () => {
    render(
      <TaskItem
        task={baseTask}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onCyclePriority={vi.fn()}
      />,
    )
    expect(screen.getByText('Test task')).toBeInTheDocument()
  })

  it('calls onToggle when checkbox is clicked', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(
      <TaskItem
        task={baseTask}
        onToggle={onToggle}
        onDelete={vi.fn()}
        onCyclePriority={vi.fn()}
      />,
    )
    await user.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledWith(1)
  })

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(
      <TaskItem
        task={baseTask}
        onToggle={vi.fn()}
        onDelete={onDelete}
        onCyclePriority={vi.fn()}
      />,
    )
    await user.click(screen.getByRole('button', { name: /Delete "Test task"/ }))
    expect(onDelete).toHaveBeenCalledWith(1)
  })

  it('calls onCyclePriority when priority dot is clicked', async () => {
    const user = userEvent.setup()
    const onCyclePriority = vi.fn()
    render(
      <TaskItem
        task={baseTask}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onCyclePriority={onCyclePriority}
      />,
    )
    await user.click(screen.getByRole('button', { name: /Priority/ }))
    expect(onCyclePriority).toHaveBeenCalledWith(1)
  })

  it('applies done class when task is complete', () => {
    const doneTask: Task = { ...baseTask, done: true }
    const { container } = render(
      <TaskItem
        task={doneTask}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onCyclePriority={vi.fn()}
      />,
    )
    expect(container.querySelector('.task-item')).toHaveClass('done')
  })

  it('applies correct priority class on dot', () => {
    const highTask: Task = { ...baseTask, priority: 'high' }
    const { container } = render(
      <TaskItem
        task={highTask}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onCyclePriority={vi.fn()}
      />,
    )
    expect(container.querySelector('.priority-dot')).toHaveClass(
      'priority-high',
    )
  })
})
