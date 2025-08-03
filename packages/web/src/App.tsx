import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type Todo = {
  id: number;
  title: string;
  category?: string;
  tags?: string[];
  completed: boolean;
  createdAt: string;
};

function App() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");

  const { data: todos, isLoading } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/todos`);
      return res.data;
    },
  });

  const createTodo = useMutation({
    mutationFn: (newTodo: Partial<Todo>) => {
      return axios.post(`${API_URL}/todos`, newTodo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setTitle("");
      setCategory("");
      setTags("");
    },
  });

  const deleteTodo = useMutation({
    mutationFn: (id: number) => axios.delete(`${API_URL}/todos/${id}`),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="app">
      <h1>Todo App</h1>
      <form
        className="todo-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          createTodo.mutate({
            title,
            category: category || undefined,
            tags: tags ? tags.split(",").map((t) => t.trim()) : undefined,
          });
        }}
      >
        <input
          className="todo-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter todo title"
        />
        <input
          className="todo-input"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
          placeholder="Category"
        />
        <input
          className="todo-input"
          value={tags}
          onChange={(e) => {
            setTags(e.target.value);
          }}
          placeholder="Tags"
        />
        <button className="add-btn" type="submit">
          Add
        </button>
      </form>
      <ul>
        {todos?.map((todo) => (
          <li key={todo.id} className="todo-item">
            <div className="todo-content">
              <span>{todo.title}</span>
              {todo.category && <small>[{todo.category}]</small>}
              {!!todo.tags?.length && <small>({todo.tags.join(",")})</small>}
            </div>
            <button
              className="delete-btn"
              onClick={() => deleteTodo.mutate(todo.id)}
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
