import { useState, useEffect } from 'react';
import { Task, Priority } from './types';

const STORAGE_KEY = 'tasks';

const PRIORITY_CYCLE: Priority[] = ['none', 'low', 'medium', 'high'];

function nextPriority(current: Priority): Priority {
  const idx = PRIORITY_CYCLE.indexOf(current);
  return PRIORITY_CYCLE[(idx + 1) % PRIORITY_CYCLE.length];
}

function loadTasks(): Task[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Task[];
  } catch {
    return [];
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text: string) => {
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), text, done: false, priority: 'none' },
    ]);
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.done));
  };

  const cyclePriority = (id: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, priority: nextPriority(t.priority) } : t
      )
    );
  };

  return { tasks, addTask, toggleTask, deleteTask, clearCompleted, cyclePriority };
}