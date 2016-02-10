const JOIN_CHANNEL = 'JOIN_CHANNEL'
const LEAVE_CHANNEL = 'LEAVE_CHANNEL'
const MESSAGE_CHANNEL = 'MESSAGE_CHANNEL'
const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE'
const CREATE_CHANNEL = 'CREATE_CHANNEL'

export default function chatService () {

  let subscribers = []
  let messages = []
  let actions = []

  let host = location.origin.replace(/^http/, 'ws')
  let ws = new WebSocket(host)

  ws.onmessage = function(e) {

    var command = JSON.parse(e.data)

    switch(command.type) {
    case MESSAGE_CHANNEL:    
    case JOIN_CHANNEL:
      //actions['join'].forEach(x => x(command))
      subscribers.forEach(x => x(command))
      break
    default:
      console.log(command)

    }
  }

  function on (event, action) {
    actions[event] = actions[event] || [] 
    actions[event].push(action)
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

  function joinChannel (channel, name) {
    ws.send(JSON.stringify({
      type: JOIN_CHANNEL,
      channel,
      name
    }))
  }

  return {
    subscribe,
    sendMessage,
    joinChannel,
    on
  }
  
}
