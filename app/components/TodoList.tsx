"use client";

import { Trash2 } from "lucide-react";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

type TodoListProps = {
  todos: Todo[];
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export default function TodoList({
  todos,
  onToggle,
  onDelete,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <p className="text-center text-zinc-400 py-12">
        No todos yet. Add one above or pick a suggestion!
      </p>
    );
  }

  return (
    <ul className="space-y-2 w-full">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-zinc-200 transition-all hover:border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:border-zinc-600"
        >
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id, !todo.completed)}
            className="h-5 w-5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span
            className={`flex-1 text-zinc-900 dark:text-zinc-100 ${
              todo.completed
                ? "line-through text-zinc-400 dark:text-zinc-500"
                : ""
            }`}
          >
            {todo.title}
          </span>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all dark:hover:bg-red-950/30"
            aria-label="Delete todo"
          >
            <Trash2 size={16} />
          </button>
        </li>
      ))}
    </ul>
  );
}
