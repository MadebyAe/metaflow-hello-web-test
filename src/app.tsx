import { useState, useEffect } from 'react';
import { Filter } from './types';
import { useTasks } from './hooks/use-tasks';
import { TaskInput } from './components/task-input';
import { Filters } from './components/filters';
import { TaskList } from './components/task-list';
import { Footer } from './components/footer';

export function App() {
  const [currentFilter, setCurrentFilter] = useState<Filter>('all');
  const { tasks, addTask, toggleTask, deleteTask, clearCompleted, cyclePriority } = useTasks();

  const filteredTasks = tasks.filter((t) => {
    if (currentFilter === 'active') return !t.done;
    if (currentFilter === 'completed') return t.done;
    return true;
  });

  const remainingCount = tasks.filter((t) => !t.done).length;
  const completedCount = tasks.length - remainingCount;

  useEffect(() => {
    document.title = remainingCount > 0 ? `(${remainingCount}) Tasks` : 'Tasks';
  }, [remainingCount]);

  return (
    <div id="app">
      <header>
        <h1>Tasks</h1>
      </header>
      <TaskInput onAdd={addTask} />
      <Filters currentFilter={currentFilter} onFilterChange={setCurrentFilter} />
      <TaskList
        tasks={filteredTasks}
        totalTasksCount={tasks.length}
        onToggle={toggleTask}
        onDelete={deleteTask}
        onCyclePriority={cyclePriority}
      />
      <Footer
        totalTasksCount={tasks.length}
        remainingCount={remainingCount}
        completedCount={completedCount}
        onClear={clearCompleted}
      />
    </div>
  );
}