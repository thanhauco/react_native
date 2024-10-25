import * as React from "react";
import { useState } from "react";
import { TextField, ListView } from '@nativescript/core';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now().toString(),
        title: newTodo,
        completed: false
      }]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <flexboxLayout className="h-full flex-col p-5 bg-gray-50">
      <flexboxLayout className="flex-row mb-4 space-x-2">
        <textField
          className="flex-1 p-3 bg-white rounded-lg border border-gray-200 text-base"
          hint="Add new todo"
          text={newTodo}
          onTextChange={(args) => setNewTodo(args.object.text)}
        />
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold"
          text="Add"
          onTap={addTodo}
        />
      </flexboxLayout>
      
      <listView
        items={todos}
        className="flex-1"
        itemTemplate={(item: Todo) => (
          <gridLayout columns="*, auto" className="p-4 bg-white mb-2 rounded-lg shadow-sm">
            <label
              col="0"
              text={item.title}
              className={`text-base ${item.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
            />
            <button
              col="1"
              text={item.completed ? "✓" : "○"}
              onTap={() => toggleTodo(item.id)}
              className={`w-10 h-10 rounded-full ${item.completed ? 'text-green-600' : 'text-blue-600'}`}
            />
          </gridLayout>
        )}
      />
    </flexboxLayout>
  );
}