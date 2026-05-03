import { useState } from 'react';

interface TaskInputProps {
  onAdd: (text: string) => void;
}

export function TaskInput({ onAdd }: TaskInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = value.trim();
    if (text) {
      onAdd(text);
      setValue('');
    }
  };

  return (
    <form id="add-form" onSubmit={handleSubmit}>
      <input
        id="task-input"
        type="text"
        placeholder="Add a task..."
        autoComplete="off"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}