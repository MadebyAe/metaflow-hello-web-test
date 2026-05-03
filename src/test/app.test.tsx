import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../app';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

beforeEach(() => {
  localStorageMock.clear();
});

describe('App', () => {
  it('renders the heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument();
  });

  it('shows empty state when no tasks exist', () => {
    render(<App />);
    expect(screen.getByText('No tasks yet — add one above')).toBeInTheDocument();
  });

  it('adds a task via the form', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByPlaceholderText('Add a task...'), 'Write tests');
    await user.click(screen.getByRole('button', { name: 'Add' }));
    expect(screen.getByText('Write tests')).toBeInTheDocument();
  });

  it('marks a task complete via checkbox', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByPlaceholderText('Add a task...'), 'Complete me');
    await user.click(screen.getByRole('button', { name: 'Add' }));
    const checkbox = screen.getByRole('checkbox', { name: /Mark "Complete me"/ });
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('deletes a task', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByPlaceholderText('Add a task...'), 'Delete me');
    await user.click(screen.getByRole('button', { name: 'Add' }));
    await user.click(screen.getByRole('button', { name: /Delete "Delete me"/ }));
    expect(screen.queryByText('Delete me')).not.toBeInTheDocument();
  });

  it('filters active and completed tasks', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByPlaceholderText('Add a task...'), 'Active task');
    await user.click(screen.getByRole('button', { name: 'Add' }));
    await user.type(screen.getByPlaceholderText('Add a task...'), 'Done task');
    await user.click(screen.getByRole('button', { name: 'Add' }));
    const doneCheckbox = screen.getByRole('checkbox', { name: /Mark "Done task"/ });
    await user.click(doneCheckbox);

    await user.click(screen.getByRole('button', { name: 'Active' }));
    expect(screen.getByText('Active task')).toBeInTheDocument();
    expect(screen.queryByText('Done task')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Completed' }));
    expect(screen.queryByText('Active task')).not.toBeInTheDocument();
    expect(screen.getByText('Done task')).toBeInTheDocument();
  });

  it('shows no tasks match message when filter has no results', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByPlaceholderText('Add a task...'), 'Active task');
    await user.click(screen.getByRole('button', { name: 'Add' }));
    await user.click(screen.getByRole('button', { name: 'Completed' }));
    expect(screen.getByText('No tasks match this filter')).toBeInTheDocument();
  });

  it('clear completed button removes done tasks', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByPlaceholderText('Add a task...'), 'Keep');
    await user.click(screen.getByRole('button', { name: 'Add' }));
    await user.type(screen.getByPlaceholderText('Add a task...'), 'Clear');
    await user.click(screen.getByRole('button', { name: 'Add' }));
    await user.click(screen.getByRole('checkbox', { name: /Mark "Clear"/ }));
    await user.click(screen.getByRole('button', { name: 'Clear completed' }));
    expect(screen.getByText('Keep')).toBeInTheDocument();
    expect(screen.queryByText('Clear')).not.toBeInTheDocument();
  });
});