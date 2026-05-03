import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTasks } from '../use-tasks';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('useTasks', () => {
  it('starts with empty task list when localStorage is empty', () => {
    const { result } = renderHook(() => useTasks());
    expect(result.current.tasks).toEqual([]);
  });

  it('loads tasks from localStorage on mount', () => {
    const stored = [{ id: 1, text: 'Existing task', done: false, priority: 'none' }];
    localStorage.setItem('tasks', JSON.stringify(stored));
    const { result } = renderHook(() => useTasks());
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].text).toBe('Existing task');
  });

  it('addTask appends a new task', () => {
    const { result } = renderHook(() => useTasks());
    act(() => { result.current.addTask('Buy milk'); });
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].text).toBe('Buy milk');
    expect(result.current.tasks[0].done).toBe(false);
    expect(result.current.tasks[0].priority).toBe('none');
  });

  it('toggleTask flips done status', () => {
    const { result } = renderHook(() => useTasks());
    act(() => { result.current.addTask('Toggle me'); });
    const id = result.current.tasks[0].id;
    act(() => { result.current.toggleTask(id); });
    expect(result.current.tasks[0].done).toBe(true);
    act(() => { result.current.toggleTask(id); });
    expect(result.current.tasks[0].done).toBe(false);
  });

  it('deleteTask removes the task', () => {
    const { result } = renderHook(() => useTasks());
    act(() => { result.current.addTask('Delete me'); });
    const id = result.current.tasks[0].id;
    act(() => { result.current.deleteTask(id); });
    expect(result.current.tasks).toHaveLength(0);
  });

  it('clearCompleted removes only completed tasks', () => {
    const { result } = renderHook(() => useTasks());
    act(() => { result.current.addTask('Keep me'); });
    act(() => { result.current.addTask('Remove me'); });
    const doneId = result.current.tasks[1].id;
    act(() => { result.current.toggleTask(doneId); });
    act(() => { result.current.clearCompleted(); });
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].text).toBe('Keep me');
  });

  it('cyclePriority cycles through none → low → medium → high → none', () => {
    const { result } = renderHook(() => useTasks());
    act(() => { result.current.addTask('Priority task'); });
    const id = result.current.tasks[0].id;
    expect(result.current.tasks[0].priority).toBe('none');
    act(() => { result.current.cyclePriority(id); });
    expect(result.current.tasks[0].priority).toBe('low');
    act(() => { result.current.cyclePriority(id); });
    expect(result.current.tasks[0].priority).toBe('medium');
    act(() => { result.current.cyclePriority(id); });
    expect(result.current.tasks[0].priority).toBe('high');
    act(() => { result.current.cyclePriority(id); });
    expect(result.current.tasks[0].priority).toBe('none');
  });

  it('persists tasks to localStorage after mutations', () => {
    const { result } = renderHook(() => useTasks());
    act(() => { result.current.addTask('Persist me'); });
    const stored = JSON.parse(localStorage.getItem('tasks') ?? '[]') as Array<{ text: string }>;
    expect(stored[0].text).toBe('Persist me');
  });
});