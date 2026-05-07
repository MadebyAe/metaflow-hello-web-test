import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTasks } from './hooks/use-tasks'
import { useTheme } from './hooks/use-theme'
import { useHashRoute } from './hooks/use-hash-route'
import { TaskInput } from './components/task-input'
import { Filters } from './components/filters'
import { TaskList } from './components/task-list'
import { Footer } from './components/footer'
import { ThemeToggle } from './components/theme-toggle'
import { StatsPage } from './components/stats-page'
import { NavLink } from './components/nav-link'

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
  const { pathname } = useLocation()

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
        <nav className="header-nav">
          <NavLink href="/" currentRoute={pathname}>
            Home
          </NavLink>
          <NavLink href="/stats" currentRoute={pathname}>
            Stats
          </NavLink>
        </nav>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      {pathname === '/stats' ? (
        <StatsPage tasks={tasks} />
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}