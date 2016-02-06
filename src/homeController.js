export default class homeController {
  constructor($scope, chatService) {
    this.chat = chatService
    this.name = 'Steve'
    this.message = ''
    this.toJoin = ''

    this.messages = []
    this.channels = ['public']
    
    this.channel = 'public'
    let nextid = 0

    this.chat.subscribe(x => {
      let {message, channel} = x
      let m = Object.assign({}, {id: nextid++}, {channel}, message)
      this.messages.push(m)
      $scope.$digest()
      console.log(this.messages)

    })
  }

  switchChannel (channel) {
    this.channel = channel
  }

  send () {
    this.chat.sendMessage({
      message: this.message,
      name: 'Steve' 
    }, this.channel)
  }

  join () {
    this.chat.joinChannel(this.toJoin)
    this.channels.push(this.toJoin)
    this.toJoin = ''
  }
}

homeController.$inject = ['$scope', 'chatService']
