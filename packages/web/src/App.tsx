import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http//:localhost:3000";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
};

function App() {
  const queryClinet = useQueryClient();
  const [title, setTitle] = useState("");

  const { data: todos, isLoading } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/todos`);
      return res.data;
    },
  });

  const createTodo = useMutation({
    mutationFn: (title: string) => {
      return axios.post(`${API_URL}/todos`, { title });
    },
    onSuccess: () => {
      queryClinet.invalidateQueries({ queryKey: ["todos"] });
      setTitle("");
    },
  });

  const deleteTodo = useMutation({
    mutationFn: (id: number) => axios.delete(`${API_URL}/todos/${id}`),
    onSuccess: () => {
      queryClinet.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 30 }}>
      <h1>Todo App</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          createTodo.mutate(title);
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter todo title"
        />
      </form>

      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>
            {todo.title}
            <button onClick={() => deleteTodo.mutate(todo.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
