const JOIN_CHANNEL = 'JOIN_CHANNEL'
const LEAVE_CHANNEL = 'LEAVE_CHANNEL'
const MESSAGE_CHANNEL = 'MESSAGE_CHANNEL'
const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE'
const CREATE_CHANNEL = 'CREATE_CHANNEL'

export default function chatService () {

  let subscribers = [];
  let messages = [];

  let host = location.origin.replace(/^http/, 'ws')
  let ws = new WebSocket(host)

  ws.onmessage = function(e) {

    var command = JSON.parse(e.data)

    switch(command.type) {
    case RECEIVE_MESSAGE:    
      subscribers.forEach(x => x(command))
      break

    }
  }


  function subscribe (f) {
    subscribers.push(f)
  }

  function sendMessage (message, channel) {
    ws.send(JSON.stringify({
      message, 
      type: MESSAGE_CHANNEL,
      channel 
    }))
  }

  function joinChannel (channel) {
    ws.send(JSON.stringify({
      type: JOIN_CHANNEL,
      channel: channel
    }))
  }

  return {
    subscribe,
    sendMessage,
    joinChannel
  }
  
}
