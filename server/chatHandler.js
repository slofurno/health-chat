var JOIN_CHANNEL = 'JOIN_CHANNEL';
var LEAVE_CHANNEL = 'LEAVE_CHANNEL';
var MESSAGE_CHANNEL = 'MESSAGE_CHANNEL';
var RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';
var CREATE_CHANNEL = 'CREATE_CHANNEL';

var topics = {};
topics["public"] = Topic();

module.exports = function connectionHandler (ws) {
  var subscriptions = [];

  function cleanup () {
    subscriptions.forEach(f => f()) 
  }

  var receiveMessage = function (message) {
    ws.send(JSON.stringify(Object.assign({},{
      type: RECEIVE_MESSAGE
    },message)), err => {
      if (err) {
        console.error(err);  
        cleanup();
      }
    });
  };

  var uf = topics['public'].subscribe(receiveMessage);
  subscriptions.push(uf);

  ws.on('message', function (msg) {
    var command = JSON.parse(msg);
    console.log(command);

    switch(command.type) {
    case JOIN_CHANNEL:
      if (!topics[command.channel]) {
        topics[command.channel] = Topic();  
      }
      var unsub = topics[command.channel].subscribe(receiveMessage);
      subscriptions.push(unsub);
      return;

    case MESSAGE_CHANNEL:
      var topic = topics[command.channel];
      if (!topic) return;
      topic.broadcast({
        message: command.message,
        channel: command.channel
      });
      return;

    default:
    }

  });

  ws.on('close', function () {
    console.log("close");
    cleanup();
  });
}

function Topic () {
  var subscribers = [];
  var messages = [];

  function subscribe (f) {
    subscribers.push(f);
    messages.forEach(x => f(x));
   
    var unsub = function () {
      var i = subscribers.indexOf(f);
      if (i < 0) return;

      subscribers = subscribers.slice(0, i).concat(subscribers.slice(i + 1));
    };

    return unsub;
  }

  function broadcast (msg) {
    messages.push(msg);
    subscribers.forEach(f => {
      f(msg);
    });
  }

  return {
    subscribe, 
    broadcast
  };
}
