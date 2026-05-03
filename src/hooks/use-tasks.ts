import { useState, useEffect } from 'react';
import { Task, Priority } from '../types';

const STORAGE_KEY = 'tasks';
const PRIORITY_CYCLE: Priority[] = ['none', 'low', 'medium', 'high'];

let nextId = Date.now();

function generateId(): number {
  return nextId++;
}

function loadTasks(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as Task[];
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
    const newTask: Task = {
      id: generateId(),
      text,
      done: false,
      priority: 'none',
    };
    setTasks((prev) => [...prev, newTask]);
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
      prev.map((t) => {
        if (t.id !== id) return t;
        const currentIndex = PRIORITY_CYCLE.indexOf(t.priority);
        const nextPriority = PRIORITY_CYCLE[(currentIndex + 1) % PRIORITY_CYCLE.length];
        return { ...t, priority: nextPriority };
      })
    );
  };

  return { tasks, addTask, toggleTask, deleteTask, clearCompleted, cyclePriority };
}