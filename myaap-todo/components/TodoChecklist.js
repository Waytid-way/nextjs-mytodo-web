"use client";

import React, { useEffect, useMemo, useState } from 'react';

function TodoChecklist() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("todos");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setTodos(parsed);
        }
      }
    } catch (_) {

    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("todos", JSON.stringify(todos));
    } catch (_) {

    }
  }, [todos]);

  const remainingCount = useMemo(
    () => todos.filter(t => !t.completed).length,
    [todos]
  );

  function addTodo(e) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    const todo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: Date.now()
    };
    setTodos(prev => [todo, ...prev]);
    setNewTitle("");
  }

  function toggleTodo(id) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  function deleteTodo(id) {
    setTodos(prev => prev.filter(t => t.id !== id));
  }

  function clearCompleted() {
    setTodos(prev => prev.filter(t => !t.completed));
  }

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: 16 }}>
      <h1 style={{ marginBottom: 12 }}>My Todo</h1>

      <form onSubmit={addTodo} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          aria-label="Add todo"
          placeholder="Add a task..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #555" }}
        />
        <button type="submit" style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #555" }}>Add</button>
      </form>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span>{remainingCount} remaining</span>
        <button onClick={clearCompleted} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #555" }}>Clear completed</button>
      </div>

      <ul style={{ listStyle: "none", display: "grid", gap: 8 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, border: "1px solid #333", borderRadius: 8 }}>
            <input
              id={`todo-${todo.id}`}
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <label htmlFor={`todo-${todo.id}`} style={{ flex: 1, textDecoration: todo.completed ? "line-through" : "none", opacity: todo.completed ? 0.6 : 1 }}>
              {todo.title}
            </label>
            <button onClick={() => deleteTodo(todo.id)} aria-label={`Delete ${todo.title}`} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #555" }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoChecklist;