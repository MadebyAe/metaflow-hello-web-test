import { useState, useEffect } from 'react';
import { Task, Priority } from '../types';

const STORAGE_KEY = 'tasks';

const PRIORITY_CYCLE: Priority[] = ['none', 'low', 'medium', 'high'];

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidTask);
  } catch {
    return [];
  }
}

function isValidTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'number' &&
    typeof obj.text === 'string' &&
    typeof obj.done === 'boolean' &&
    ['none', 'low', 'medium', 'high'].includes(obj.priority as string)
  );
}

function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // localStorage may be unavailable (private browsing quota exceeded, etc.)
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  function addTask(text: string): void {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newTask: Task = {
      id: Date.now(),
      text: trimmed,
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

  function clearCompleted(): void {
    setTasks((prev) => prev.filter((t) => !t.done));
  }

  function cyclePriority(id: number): void {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const currentIndex = PRIORITY_CYCLE.indexOf(t.priority);
        const nextPriority = PRIORITY_CYCLE[(currentIndex + 1) % PRIORITY_CYCLE.length];
        return { ...t, priority: nextPriority };
      })
    );
  }

  return { tasks, addTask, toggleTask, deleteTask, clearCompleted, cyclePriority };
}