import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useParams } from "react-router-dom";

import { getTodos, postTodos, putTodoById, deleteTodoById } from "./apis/todos";

const Todo = ({ todo = {}, group_id = 1, disabled = false }) => {
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
            disabled={disabled}
            onClick={() => {
              updateTodo.mutate({
                todo: { ...todo, title: newTitle },
                id: todo?.id,
                group_id,
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
            disabled={disabled}
            onClick={() => {
              deleteTodo.mutate({ id: todo?.id, group_id });
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
  const { id } = useParams();
  const currentGroup = id || 1;

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

  const {
    sendMessage,
    // lastMessage,
    readyState,
    // getWebSocket,
  } = useWebSocket("ws://localhost:8000/cable", {
    // share: true,
    queryParams: { channel: "UpdatesChannel" },
    onMessage: (message) => {
      const messageData = JSON.parse(message?.data || null);
      if (messageData?.type !== "ping") {
        console.log(messageData);
      }
      if (messageData?.identifier) {
        const messageDataIdentifier = JSON.parse(messageData?.identifier);
        if (messageDataIdentifier?.channel === "UpdatesChannel") {
          const todoData = messageData?.message?.json || [];
          setTodos([...todoData]);
          // console.log({ todoData });
        }
      }
    },
  });

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  useEffect(() => {
    if (connectionStatus === "Open") {
      sendMessage(
        JSON.stringify({
          command: "subscribe",
          identifier: `{"channel":"UpdatesChannel", "group_id": ${currentGroup}}`,
        })
      );
    }
  }, [connectionStatus, sendMessage, currentGroup]);

  const loader = todosStatus === "loading" || isTodosLoading || isTodosFetching;

  if (loader) {
    return <p>Loading....</p>;
  }

  return (
    <div>
      <span>The WebSocket is currently {connectionStatus}</span>

      {todos?.map((todo) => (
        <Todo
          key={todo?.id}
          todo={todo}
          group_id={currentGroup}
          disabled={readyState !== ReadyState.OPEN}
        />
      ))}

      <div>
        <input
          value={newTodo}
          onChange={(e) => {
            setNewTodo(e?.target?.value);
          }}
        />
        <button
          disabled={readyState !== ReadyState.OPEN}
          onClick={() => {
            createTodo.mutate({
              todo: { title: newTodo },
              group_id: currentGroup,
            });
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
