class UpdatesChannel < ApplicationCable::Channel
  def subscribed
    stream_from "updates_channel_#{params[:group_id]}"
    # todos = Todo.all
    # stream_for todos
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
