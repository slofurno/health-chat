const JOIN_CHANNEL = 'JOIN_CHANNEL'
const LEAVE_CHANNEL = 'LEAVE_CHANNEL'
const MESSAGE_CHANNEL = 'MESSAGE_CHANNEL'
const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE'
const CREATE_CHANNEL = 'CREATE_CHANNEL'
const SET_NAME = 'SET_NAME'

export default function chatService () {

  let subscribers = []
  let messages = []
  let actions = []

  let host = location.origin.replace(/^http/, 'ws')
  let ws = new WebSocket(host)
  let users = {};

  ws.onmessage = function(e) {

    var command = JSON.parse(e.data)
    console.log(command)

    switch(command.type) {
    case MESSAGE_CHANNEL:    
    case JOIN_CHANNEL:
    case LEAVE_CHANNEL:
    case SET_NAME:
      //actions['join'].forEach(x => x(command))
      subscribers.forEach(x => x(command))
      break
    default:

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
      channel,
      type: MESSAGE_CHANNEL
    }))
  }

  function joinChannel (channel) {
    ws.send(JSON.stringify({
      type: JOIN_CHANNEL,
      channel
    }))
  }

  function leaveChannel (channel) {
    ws.send(JSON.stringify({
      type: LEAVE_CHANNEL,
      channel
    }))
  }

  function setName (name) {
    ws.send(JSON.stringify({
      type: SET_NAME,
      name 
    }))
  }

  return {
    subscribe,
    sendMessage,
    joinChannel,
    leaveChannel,
    setName,
    on
  }
  
}
