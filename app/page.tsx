"use client";

import { useEffect, useState, useCallback } from "react";
import TodoForm from "@/app/components/TodoForm";
import TodoList, { type Todo } from "@/app/components/TodoList";
import Suggestions from "@/app/components/Suggestions";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = useCallback(async () => {
    try {
      const res = await fetch("/api/todos");
      if (res.ok) setTodos(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  async function handleAdd(title: string) {
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      const todo = await res.json();
      setTodos((prev) => [todo, ...prev]);
    }
  }

  async function handleToggle(id: string, completed: boolean) {
    await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed } : t))
    );
  }

  async function handleDelete(id: string) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <header className="w-full border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Todo App
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Stay organized with AI-powered suggestions
          </p>
        </div>
      </header>

      <main className="w-full max-w-2xl mx-auto px-4 py-8 space-y-6">
        <TodoForm onAdd={handleAdd} />

        <div className="grid gap-6 md:grid-cols-[1fr_280px]">
          <section>
            {loading ? (
              <div className="flex items-center justify-center py-12 text-sm text-zinc-400">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-zinc-300 border-t-blue-500 mr-2" />
                Loading todos...
              </div>
            ) : (
              <TodoList
                todos={todos}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            )}
          </section>

          <aside className="md:sticky md:top-8 self-start">
            <Suggestions onAdd={handleAdd} />
          </aside>
        </div>
      </main>
    </div>
  );
}
