import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatsPage } from '../components/stats-page/stats-page'
import { Task } from '../types'

const makeTasks = (overrides: Partial<Task>[] = []): Task[] =>
  overrides.map((o, i) => ({
    id: i,
    text: `Task ${i}`,
    done: false,
    priority: 'none',
    ...o,
  }))

describe('StatsPage', () => {
  it('shows empty state when there are no tasks', () => {
    render(<StatsPage tasks={[]} />)
    expect(
      screen.getByText(/No tasks yet — add some to see your stats/),
    ).toBeInTheDocument()
  })

  it('displays correct total, open, and completed counts', () => {
    const tasks = makeTasks([
      { done: false },
      { done: false },
      { done: true },
    ])
    render(<StatsPage tasks={tasks} />)
    expect(screen.getByText('3')).toBeInTheDocument() // total
    expect(screen.getByText('2')).toBeInTheDocument() // open
    expect(screen.getByText('1')).toBeInTheDocument() // completed
  })

  it('shows 100% progress when all tasks are done', () => {
    const tasks = makeTasks([{ done: true }, { done: true }])
    render(<StatsPage tasks={tasks} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('shows 0% progress when no tasks are done', () => {
    const tasks = makeTasks([{ done: false }, { done: false }])
    render(<StatsPage tasks={tasks} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('shows correct progress percentage', () => {
    const tasks = makeTasks([
      { done: true },
      { done: false },
      { done: false },
      { done: false },
    ])
    render(<StatsPage tasks={tasks} />)
    expect(screen.getByText('25%')).toBeInTheDocument()
  })

  it('renders priority breakdown for tasks with set priorities', () => {
    const tasks = makeTasks([
      { priority: 'high', done: false },
      { priority: 'high', done: true },
      { priority: 'low', done: false },
    ])
    render(<StatsPage tasks={tasks} />)
    expect(screen.getByText('High')).toBeInTheDocument()
    expect(screen.getByText('Low')).toBeInTheDocument()
  })

  it('does not render priority breakdown when all tasks have no priority', () => {
    const tasks = makeTasks([{ priority: 'none' }, { priority: 'none' }])
    render(<StatsPage tasks={tasks} />)
    expect(screen.queryByText('By priority')).not.toBeInTheDocument()
  })

  it('renders a progress bar with the correct aria attributes', () => {
    const tasks = makeTasks([{ done: true }, { done: false }])
    render(<StatsPage tasks={tasks} />)
    const progressbar = screen.getByRole('progressbar', {
      name: 'Task completion progress',
    })
    expect(progressbar).toHaveAttribute('aria-valuenow', '50')
    expect(progressbar).toHaveAttribute('aria-valuemin', '0')
    expect(progressbar).toHaveAttribute('aria-valuemax', '100')
  })
})