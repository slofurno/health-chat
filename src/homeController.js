const JOIN_CHANNEL = 'JOIN_CHANNEL'
const SET_NAME = 'SET_NAME'
const LEAVE_CHANNEL = 'LEAVE_CHANNEL'
const MESSAGE_CHANNEL = 'MESSAGE_CHANNEL'
const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE'
const CREATE_CHANNEL = 'CREATE_CHANNEL'

export default class homeController {
  constructor($scope, chatService) {
    this.chat = chatService
    this.name = 'user'
    this.message = ''
    this.toJoin = ''
    this.mouseDown = false

    this.messages = []
    this.channels = ['public']

    this.users = {};
    
    this.channel = 'public'
    this.scroll = 0
    let nextid = 0

    this.chat.subscribe(command => {
      const {message, name, channel, user} = command

      switch(command.type) {
      case SET_NAME:
        var m = Object.assign({}, {id: nextid++}, {message:`${this.users[user]||"user"} has changed his name to ${name}`}, command)
        this.messages.push(m)
        this.users[command.user] = name
        break;
      case MESSAGE_CHANNEL:    
        var m = Object.assign({}, {id: nextid++}, {message, channel, name})
        this.messages.push(m)
        break;

      case JOIN_CHANNEL:
        var joined = {
          message: `${name} has joined`,
          name: 'channel'
        }
        var m = Object.assign({}, {id: nextid++}, {channel}, joined)
        this.messages.push(m)
        break

      case LEAVE_CHANNEL:
        console.log("???", command);
        var left = {
          message: `${name} has left`,
          name: 'channel'
        }
        var m = Object.assign({}, {id: nextid++}, {channel}, left)
        this.messages.push(m)
        break;
      }
      $scope.$digest()

    })
  }

  switchChannel (channel) {
    this.channel = channel
  }

  send () {
    this.chat.sendMessage(this.message, this.channel)
    this.message = ''
  }

  join () {
    this.chat.joinChannel(this.toJoin)
    this.channels.push(this.toJoin)
    this.toJoin = ''
  }

  setName () {
    this.chat.setName(this.name)
  }

  getMessages () {
    let chan = this.channel
    return this.messages.filter(m => m.channel === chan).slice(-20)
    //return messages.map(m => Object.assign({}, {name: this.users[m.user]}, m))
  }

  mousemove (e) {
    e.preventDefault()
    if (this.mouseDown) {
      let dx = e.movementX;
      let dy = e.movementY;

      console.log(dx, dy)
      this.scroll = this.scroll + dy;
    }
  }

  mousedown (e) {
    console.log(e);
    this.mouseDown = true
  }

  mouseup (e) {

    console.log(e);
    this.mouseDown = false
  }
}

homeController.$inject = ['$scope', 'chatService']
