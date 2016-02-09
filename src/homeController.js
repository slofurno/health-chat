const JOIN_CHANNEL = 'JOIN_CHANNEL'
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

    this.messages = []
    this.channels = ['public']
    
    this.channel = 'public'
    let nextid = 0

    this.chat.subscribe(command => {
      let {channel} = command

      switch(command.type) {
      case MESSAGE_CHANNEL:    
        var {message} = command
        var m = Object.assign({}, {id: nextid++}, {channel}, message)
        this.messages.push(m)

        console.log(m, command)
        break;

      case JOIN_CHANNEL:
        let {name} = command
        var message = {
          message: `${name} has joined`,
          name: 'channel'
        }
        var m = Object.assign({}, {id: nextid++}, {channel}, message)

        console.log(m, command)
        this.messages.push(m)
        break
      }
      $scope.$digest()

    })
  }

  switchChannel (channel) {
    this.channel = channel
  }

  send () {
    this.chat.sendMessage({
      message: this.message,
      name: this.name 
    }, this.channel)

    this.message = ''
  }

  join () {
    this.chat.joinChannel(this.toJoin, this.name)
    this.channels.push(this.toJoin)
    this.toJoin = ''
  }

  getMessages () {
    let chan = this.channel
    return this.messages.filter(m => m.channel === chan).slice(-20)
  }
}

homeController.$inject = ['$scope', 'chatService']
