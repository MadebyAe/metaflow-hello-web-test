import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../app';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
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

  describe('ThemeToggle', () => {
    it('renders the theme toggle button', () => {
      render(<App />);
      const btn = screen.getByRole('button', { name: /switch to (light|dark) mode/i });
      expect(btn).toBeInTheDocument();
    });

    it('toggle button has accessible label reflecting target state', () => {
      render(<App />);
      const btn = screen.getByRole('button', { name: /switch to (light|dark) mode/i });
      // aria-label should mention the mode we are switching TO
      expect(btn).toHaveAttribute('aria-label');
      const label = btn.getAttribute('aria-label')!.toLowerCase();
      expect(label).toMatch(/switch to (light|dark) mode/);
    });

    it('updates data-theme attribute on <html> when toggled', async () => {
      const user = userEvent.setup();
      render(<App />);
      const btn = screen.getByRole('button', { name: /switch to (light|dark) mode/i });
      const before = document.documentElement.getAttribute('data-theme');
      await user.click(btn);
      const after = document.documentElement.getAttribute('data-theme');
      expect(after).not.toEqual(before);
      expect(['light', 'dark']).toContain(after);
    });

    it('toggles theme back and forth on repeated clicks', async () => {
      const user = userEvent.setup();
      render(<App />);
      const btn = screen.getByRole('button', { name: /switch to (light|dark) mode/i });
      const initial = document.documentElement.getAttribute('data-theme');
      await user.click(btn);
      const toggled = document.documentElement.getAttribute('data-theme');
      expect(toggled).not.toEqual(initial);
      await user.click(screen.getByRole('button', { name: /switch to (light|dark) mode/i }));
      const restored = document.documentElement.getAttribute('data-theme');
      expect(restored).toEqual(initial);
    });

    it('persists theme choice to localStorage', async () => {
      const user = userEvent.setup();
      render(<App />);
      const btn = screen.getByRole('button', { name: /switch to (light|dark) mode/i });
      await user.click(btn);
      const stored = localStorage.getItem('theme');
      expect(['light', 'dark']).toContain(stored);
      expect(stored).toEqual(document.documentElement.getAttribute('data-theme'));
    });

    it('aria-pressed reflects dark mode state', async () => {
      const user = userEvent.setup();
      render(<App />);
      const btn = screen.getByRole('button', { name: /switch to (light|dark) mode/i });
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const expectedPressed = currentTheme === 'dark' ? 'true' : 'false';
      expect(btn).toHaveAttribute('aria-pressed', expectedPressed);
      await user.click(btn);
      const newTheme = document.documentElement.getAttribute('data-theme');
      const newExpectedPressed = newTheme === 'dark' ? 'true' : 'false';
      expect(
        screen.getByRole('button', { name: /switch to (light|dark) mode/i })
      ).toHaveAttribute('aria-pressed', newExpectedPressed);
    });
  });
});
