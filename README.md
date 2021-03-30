### Overview

A basic todo application with live reload using websockets. If two or more tabs/windows are open with the same application, making changes (adding, editing and deleting todos) to in one window or tab will automatically get reflected in other windows.

### Backend

- Backend of this application is made with Ruby on Rails.
- I used action cable to create a channel called updates channel
- Whenever a new todo is created or an existing todo is updated or deleted, an array updated todo objects are sent to the websocket channel.

### Frontend

- Frontend of this application is built with React.
- I used axios and react-query to make basic API calls.
- Then I used websocket's w3cwebsocket to create a client and subscribe to the updates_channel
- Folder structure:
  - apis folder have all the required REST API calls in axios
  - There is a component called Todos where the client is initiated, subscribes and handles received messages.
  - On receiving new todos it updates it's internal state thereby updating UI.

References:

- https://dev.to/dtroyano86/setting-up-a-basic-crud-rails-api-1mad
- https://medium.com/@dakota.lillie/using-action-cable-with-react-c37df065f296

! [screen recording with two windows and automatic updates] (https://github.com/pbpranavk/websockets_react_rails_todo/blob/master/todo_with_websockets.gif)
