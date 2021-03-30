import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/";

const getTodos = async () => {
  const { data } = await axios.get("/todos");
  return data;
};

const postTodos = async (todo) => {
  const { data } = await axios.post("/todos", { todo });
  return data;
};

const putTodoById = async ({ todo, id }) => {
  const { data } = await axios.put(`/todos/${id}`, { todo });
  return data;
};

const deleteTodoById = async ({ id }) => {
  const { data } = await axios.delete(`/todos/${id}`);
  return data;
};

export { getTodos, postTodos, putTodoById, deleteTodoById };
