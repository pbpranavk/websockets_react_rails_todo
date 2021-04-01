import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/";

const getTodos = async () => {
  const { data } = await axios.get("/todos");
  return data;
};

const postTodos = async ({ todo, group_id }) => {
  const { data } = await axios.post("/todos", { todo, group_id });
  return data;
};

const putTodoById = async ({ todo, id, group_id }) => {
  const { data } = await axios.put(`/todos/${id}`, { todo, group_id });
  return data;
};

const deleteTodoById = async ({ id, group_id }) => {
  const { data } = await axios.delete(`/todos/${id}`, { group_id });
  return data;
};

export { getTodos, postTodos, putTodoById, deleteTodoById };
