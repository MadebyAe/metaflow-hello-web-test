import { useEffect } from 'react'
import { useTasks } from './hooks/use-tasks'
import { useTheme } from './hooks/use-theme'
import { useHashRoute } from './hooks/use-hash-route'
import { TaskInput } from './components/task-input'
import { Filters } from './components/filters'
import { TaskList } from './components/task-list'
import { Footer } from './components/footer'
import { ThemeToggle } from './components/theme-toggle'

export function App() {
  const [currentFilter, setCurrentFilter] = useHashRoute()
  const {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted,
    cyclePriority,
  } = useTasks()
  const { theme, toggleTheme } = useTheme()

  const filteredTasks = tasks.filter((t) => {
    if (currentFilter === 'active') return !t.done
    if (currentFilter === 'completed') return t.done
    return true
  })

  const remainingCount = tasks.filter((t) => !t.done).length
  const completedCount = tasks.length - remainingCount

  useEffect(() => {
    document.title = remainingCount > 0 ? `(${remainingCount}) Tasks` : 'Tasks'
  }, [remainingCount])

  return (
    <div id="app">
      <header>
        <h1>Tasks</h1>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>
      <TaskInput onAdd={addTask} />
      <Filters
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
      />
      <TaskList
        tasks={filteredTasks}
        totalTasksCount={tasks.length}
        onToggle={toggleTask}
        onDelete={deleteTask}
        onCyclePriority={cyclePriority}
      />
      <Footer
        remainingCount={remainingCount}
        completedCount={completedCount}
        onClear={clearCompleted}
      />
    </div>
  )
}