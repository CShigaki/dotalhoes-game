var util = require('util');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var morgan = require('morgan');
var port = 8005;

var Player = require('./Player').Player;
var playersOnline = new Array();
var rooms = ['lala', 'lele'];

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
var io = require('socket.io').listen(server);

// Listen for connections from all ips.
server.listen((process.env.PORT || port), '0.0.0.0');

console.log('Listening to port ' + (process.env.PORT || 8005));

// Init function to start the game.
function init() {
  setEventHandlers();
}

// Game event handlers
function setEventHandlers() {
  io.sockets.on('connection', onSocketConnection);
}

// Register messages between clients and the server.
function onSocketConnection(client) {
  client.on('player-login', playerLogin);
  client.on('player-disconnected', playerDisconnected);
  client.on('player-join', playerJoinedRoom);
  client.on('get-rooms', getRooms);
  client.on('create-room', createRoom);
  client.on('player-move', movePlayer);
  client.on('players-data', sendPlayersData);
  client.on('player-list', sendPlayersData);
  //client.on('join-room', playerJoinRoom);

  console.log('Player connected: ' + client.id);
}

// Callback that validates player login, currently not checking.
function playerLogin(data) {
  var statusMessage = '';
  var client = this;

  client.emit('login-checked', {found: true, login: client.id, id: client.id, message: ''});

  this.emit('start-game');
}

// Callback performed when a player joins a room.
function playerJoinedRoom(data) {
  var player = new Player(data.player.id,
                          data.player.name,
                          data.server,
                          data.player.position,
                          data.player.rotation,
                          data.player.color,
                          this);
  playersOnline.push(player);
  for (var p of playersOnline) {
    p.socket.emit('player-joined-room', {"player": p.serverInfo()});
  }
}

// Callback performed when a player disconnects from the server.
function playerDisconnected(data) {
  var n_of_players = playersOnline.length;
  for (var i = 0; i < n_of_players; i++) {
    if (playersOnline[i]['playerID'] == this.id) {
      playersOnline.splice(i, 1);
      playersOnline[i].socket.emit('player-disconnected', { name: playersOnline[i]['name'] });
      break;
    }
  }
}

// Callback that updates player position.
function movePlayer(data) {
  var n_of_players = playersOnline.length;
  for (var i = 0; i < n_of_players; i++) {
    if (playersOnline[i].id == data.id) {
      playersOnline[i].position = data.position;
      playersOnline[i].rotation = data.rotation;
    }
  }
}

// Send information of other players to all clients.
function sendPlayersData(data) {
  var playersData = new Array();
  var toClient = this;
  var n_of_players = playersOnline.length;
  for (var i = 0; i < n_of_players; i++) {
    playersData.push(playersOnline[i].serverInfo());
  }
  if (playersData.length > 0) {
    this.emit('players-data', playersData);
  }
}

// Return the list of all available rooms.
function getRooms() {
  this.emit('rooms', {'rooms': rooms});
}

// Create a new room.
function createRoom(data) {
  rooms.push(data.name);
  this.emit('rooms', {'rooms': rooms});
}

init();