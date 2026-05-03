import { useState, useEffect } from 'react';
import type { Task, Priority } from '../types';

const PRIORITY_CYCLE: Priority[] = ['none', 'low', 'medium', 'high'];

function nextPriority(current: Priority): Priority {
  const index = PRIORITY_CYCLE.indexOf(current);
  return PRIORITY_CYCLE[(index + 1) % PRIORITY_CYCLE.length];
}

function loadTasksFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem('tasks');
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    return [];
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasksFromStorage);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const remainingCount = tasks.filter((t) => !t.done).length;
  const completedCount = tasks.length - remainingCount;

  useEffect(() => {
    document.title = remainingCount > 0 ? `(${remainingCount}) Tasks` : 'Tasks';
  }, [remainingCount]);

  function addTask(text: string): void {
    const newTask: Task = {
      id: Date.now(),
      text,
      done: false,
      priority: 'none',
    };
    setTasks((prev) => [...prev, newTask]);
  }

  function toggleTask(id: number): void {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function deleteTask(id: number): void {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function cyclePriority(id: number): void {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, priority: nextPriority(t.priority) } : t
      )
    );
  }

  function clearCompleted(): void {
    setTasks((prev) => prev.filter((t) => !t.done));
  }

  return {
    tasks,
    remainingCount,
    completedCount,
    addTask,
    toggleTask,
    deleteTask,
    cyclePriority,
    clearCompleted,
  };
}