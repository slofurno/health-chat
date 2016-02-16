var crypto = require('crypto');
var JOIN_CHANNEL = 'JOIN_CHANNEL';
var LEAVE_CHANNEL = 'LEAVE_CHANNEL';
var MESSAGE_CHANNEL = 'MESSAGE_CHANNEL';
var RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';
var CREATE_CHANNEL = 'CREATE_CHANNEL';
var SET_NAME = 'SET_NAME';

var topics = {};
var users = {};
topics["public"] = Topic();

module.exports = function connectionHandler (ws) {
  var subscriptions = {};
  var myid = crypto.randomBytes(16).toString('hex');
  users[myid] = "user";

  function cleanup () {
    Object.keys(subscriptions).forEach(c => subscriptions[c]());
  }

  function joinChannel (channel) {
    if (subscriptions[channel]) return;

    var unsub = topics[channel].subscribe(receiveMessage);
    subscriptions[channel] = unsub;
  }

  function leaveChannel (channel) {
    if (subscriptions[channel]) {
      var unsub = subscriptions[channel];
      unsub();
      delete subscriptions[channel];
    }
  }

  function receiveMessage (message) {
    ws.send(JSON.stringify(message), err => {
      if (err) {
        console.error(err);  
        cleanup();
      }
    });
  };

  joinChannel("public");

  ws.on('message', function (msg) {
    var command = JSON.parse(msg);
    command.user = myid;
    if (command.type !== SET_NAME) {
      command.name = users[command.user];
    }

    console.log(command);

    switch(command.type) {
    case SET_NAME:
      users[myid] = command.name;
      var topic = topics["public"];
      topic.broadcast(command);
      return

    case JOIN_CHANNEL:
      if (!topics[command.channel]) {
        topics[command.channel] = Topic();  
      }

      topics[command.channel].broadcast(command);
      joinChannel(command.channel);
      return;

    case LEAVE_CHANNEL:
      if (!topics[command.channel]) return;

      var topic = topics[command.channel];
      topic.broadcast(command);
      leaveChannel(command.channel);
      return;

    case MESSAGE_CHANNEL:
      var topic = topics[command.channel];
      if (!topic) return;
      topic.broadcast(command);
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
