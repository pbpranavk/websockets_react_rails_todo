import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";

import { getTodos, postTodos, putTodoById, deleteTodoById } from "./apis/todos";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket("ws://127.0.0.1:8000/cable");

const Todo = ({ todo = {} }) => {
  const updateTodo = useMutation(putTodoById, {
    onSuccess: () => {
      setIsEditing(false);
    },
    onError: () => {},
  });

  const deleteTodo = useMutation(deleteTodoById);

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo?.title || "");

  const todoTitleProp = todo?.title || "";
  useEffect(() => {
    setNewTitle(todoTitleProp);
  }, [todoTitleProp]);

  const handleEditing = () => {
    setIsEditing(!isEditing);
  };

  return (
    <>
      {isEditing ? (
        <div>
          <input
            value={newTitle}
            onChange={(e) => {
              setNewTitle(e?.target?.value);
            }}
          />
          <button
            onClick={() => {
              updateTodo.mutate({
                todo: { ...todo, title: newTitle },
                id: todo?.id,
              });
            }}
          >
            save
          </button>
          <button onClick={handleEditing}>cancel</button>
        </div>
      ) : (
        <div>
          <p>{todo?.title || ""}</p>
          <button onClick={handleEditing}>edit</button>
          <button
            onClick={() => {
              deleteTodo.mutate({ id: todo?.id });
            }}
          >
            delete
          </button>
        </div>
      )}
    </>
  );
};

const Todos = (props) => {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);

  const {
    status: todosStatus,
    isLoading: isTodosLoading,
    isFetching: isTodosFetching,
  } = useQuery("getTodos", getTodos, {
    onSuccess: (data) => {
      setTodos(data);
    },
  });

  const createTodo = useMutation(postTodos, {
    onSuccess: () => {
      setNewTodo("");
    },
  });

  useEffect(() => {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
      client.send(
        JSON.stringify({
          command: "subscribe",
          identifier: '{"channel":"UpdatesChannel"}',
        })
      );
    };

    client.onmessage = (message) => {
      const messageData = JSON.parse(message?.data || {});
      if (messageData?.identifier) {
        const messageDataIdentifier = JSON.parse(messageData?.identifier);
        if (messageDataIdentifier?.channel === "UpdatesChannel") {
          const todoData = messageData?.message?.json || [];
          setTodos([...todoData]);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loader = todosStatus === "loading" || isTodosLoading || isTodosFetching;

  if (loader) {
    return <p>Loading....</p>;
  }

  return (
    <div>
      {todos?.map((todo) => (
        <Todo key={todo?.id} todo={todo} />
      ))}

      <div>
        <input
          value={newTodo}
          onChange={(e) => {
            setNewTodo(e?.target?.value);
          }}
        />
        <button
          onClick={() => {
            createTodo.mutate({ title: newTodo });
          }}
        >
          Create New Todo
        </button>
        <button
          onClick={() => {
            setNewTodo("");
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

Todos.propTypes = {};

export default Todos;
