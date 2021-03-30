### Overview

A basic todo application with live reload using websockets. If two or more tabs/windows are open with the same application, making changes (adding, editing and deleting todos) to in one window or tab will automatically get reflected in other windows.

### Backend

- Backend of this application is made with Ruby on Rails.
- I used action cable to create a channel called updates channel
- Whenever a new todo is created or an existing todo is updated or deleted, an array updated todo objects are sent to the websocket channel.

To Run BE:

- bundle install
- rails s -p 8000

### Frontend

- Frontend of this application is built with React.
- I used axios and react-query to make basic API calls.
- Then I used websocket's w3cwebsocket to create a client and subscribe to the updates_channel
- Folder structure:
  - apis folder have all the required REST API calls in axios
  - There is a component called Todos where the client is initiated, subscribes and handles received messages.
  - On receiving new todos it updates it's internal state thereby updating UI.

To Run FE:

- npm install or yarn install
- yarn start

### References:

- https://dev.to/dtroyano86/setting-up-a-basic-crud-rails-api-1mad
- https://medium.com/@dakota.lillie/using-action-cable-with-react-c37df065f296

- Design your architecture in such a way that one websocket connection should be enought:
  - https://stackoverflow.com/a/52131037
  - https://stackoverflow.com/a/48976054

![An example with live reload for todos between two windows](https://user-images.githubusercontent.com/18286521/112945409-dcef9780-9151-11eb-878c-0b1abf5d3b54.gif)

An example with live reload for todos between two windows
