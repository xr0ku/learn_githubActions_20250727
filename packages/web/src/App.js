import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
function App() {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const { data: todos, isLoading } = useQuery({
        queryKey: ["todos"],
        queryFn: async () => {
            const res = await axios.get(`${API_URL}/todos`);
            return res.data;
        },
    });
    const createTodo = useMutation({
        mutationFn: (newTodo) => {
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
        mutationFn: (id) => axios.delete(`${API_URL}/todos/${id}`),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });
    if (isLoading)
        return _jsx("p", { children: "Loading..." });
    return (_jsxs("div", { className: "app", children: [_jsx("h1", { children: "Todo App" }), _jsxs("form", { className: "todo-form", onSubmit: (e) => {
                    e.preventDefault();
                    if (!title.trim())
                        return;
                    createTodo.mutate({
                        title,
                        category: category || undefined,
                        tags: tags ? tags.split(",").map((t) => t.trim()) : undefined,
                    });
                }, children: [_jsx("input", { className: "todo-input", value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Enter todo title" }), _jsx("input", { className: "todo-input", value: category, onChange: (e) => {
                            setCategory(e.target.value);
                        }, placeholder: "Category" }), _jsx("input", { className: "todo-input", value: tags, onChange: (e) => {
                            setTags(e.target.value);
                        }, placeholder: "Tags" }), _jsx("button", { className: "add-btn", type: "submit", children: "Add" })] }), _jsx("ul", { children: todos?.map((todo) => (_jsxs("li", { className: "todo-item", children: [_jsxs("div", { className: "todo-content", children: [_jsx("span", { children: todo.title }), todo.category && _jsxs("small", { children: ["[", todo.category, "]"] }), !!todo.tags?.length && _jsxs("small", { children: ["(", todo.tags.join(","), ")"] })] }), _jsx("button", { className: "delete-btn", onClick: () => deleteTodo.mutate(todo.id), children: "X" })] }, todo.id))) })] }));
}
export default App;
