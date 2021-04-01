class TodosController < ApplicationController
    def index
        puts "hi"
        ActionCable.server.broadcast 'updates_channel', json:Todo.all
        render json:Todo.all
    end

    def create
        todo = Todo.create(todo_params)
        if todo.save
          # serialized_data = ActiveModelSerializers::Adapter::Json.new(
          #   TodoSerializer.new(todo)
          # ).serializable_hash
          ActionCable.server.broadcast "updates_channel_#{params[:group_id]}", json:Todo.all
          # UpdatesChannel.broadcast_to  todo
          render json: todo
        else
          render json: {message: "Saving Unsuccessful"}
      end
    end

    def update
      todo = Todo.find(params[:id])
      todo.update_attributes(todo_params)
      if todo.save
        ActionCable.server.broadcast "updates_channel_#{params[:group_id]}", json:Todo.all
        render json: todo
      else
        render json: {message: "Saving Unsuccessful"}
      end
    end

    def destroy
      Todo.destroy(params[:id])
      ActionCable.server.broadcast "updates_channel_#{params[:group_id]}", json:Todo.all
      render json: {message: "Todo deleted successfully"}
    end

    def me
      todo = Todo.find(params[:id])
      render json: todo
    end


    private
    def todo_params
      params.require(:todo).permit(:title)
    end
end
