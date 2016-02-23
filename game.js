var util = require("util");         // Utility resources (logging, object inspection, etc)
var express = require('express');
var app = express();
var server = require('http').createServer(app)
var morgan = require('morgan');
var port = 8005;
var Player = require('./Player').Player;
var playersOnline = new Array();

app.use(morgan('dev'));
db = require('mongojs').connect('localhost/mongogame', ['users']),
app.use(express.static(__dirname + '/public'));
var io = require('socket.io').listen(server);

server.listen((process.env.PORT || 8005), "0.0.0.0");

console.log('listening to port ' + (process.env.PORT || 8005));

// Init function to start the game
function init() {
  setEventHandlers();
}

/** Game event handlers **/
function setEventHandlers() {
  io.sockets.on('connection', onSocketConnection);
};

function onSocketConnection(client) {
  // Search the database for the credentials and login.
  client.on('login_data', playerLogin);

  client.on('disconnect', playerDisconnected);

  //client.on('rooms info', sendRoomsInfo);

  client.on('player move', movePlayer);

  client.on('send players data', sendOtherPlayersData);

  client.on('succesfully logged', playerSuccesfullyLogged);

  client.on('player killed', playerKilled);

  client.on('shoot gun', playerShot);

  console.log('Player connected: ' + client.id);
}

function playerKilled(data) {
  io.to(data.server).emit('player killed info', { playerName: data.playerName, gun: data.gun, killer: data.killer } );
}

function sendRoomsInfo() {
  this.emit('received rooms info');
}

function playerShot(data) {
  io.to(data.server).emit('new bullet', { mouseX: data.mouseX, mouseY: data.mouseY, speed: data.speed, owner: data.playerName } );
  //io.emit('new bullet', { mouseX: data.mouseX, mouseY: data.mouseY, speed: data.speed, owner: data.playerName } );
  //this.broadcast.emit('new bullet', { mouseX: data.mouseX, mouseY: data.mouseY, speed: data.speed, owner: data.playerName });
  /*for (var i = 0; i < playersOnline.length; i++) {
    //console.log('Player shot: ' + data.playerName + ' X: ' + data.mouseX + ' Y: ' + data.mouseY);
    playersOnline[i].socket.emit('new bullet', { mouseX: data.mouseX, mouseY: data.mouseY, speed: data.speed, owner: data.playerName });
  }*/
}

function playerSuccesfullyLogged(data) {
  for (var i =0; i < playersOnline.length; i++) {
    console.log('player logged in');
    if (playersOnline[i].playerID != data.id) {
      console.log(io.nsps['/'].adapter.rooms[data.server][playersOnline[i].playerID]);
      if (io.nsps['/'].adapter.rooms[data.server][playersOnline[i].playerID]) {
        playersOnline[i].socket.emit('player joined', { posX: data.posX, posY: data.posY, playerName: data.playerName, color: data.color, hp: data.hp } );
        this.emit('player joined', { posX: playersOnline[i].posX, posY: playersOnline[i].posY, playerName: playersOnline[i].playerName, color: playersOnline[i].color, hp: data.hp } );
      }
    }
  }

  var zombieCoordinates = new Array();
  for (var x = 0; x < 1520; x += 50) {
    for (var y = 0; y < 832; y += 831) {
      if (Math.random() < 0.2) {
        zombieCoordinates.push({ x: x, y: y, type: 'common'});
      }
    }
  }
  io.emit('zombies coordinates', { coordinates: zombieCoordinates });
}

function playerDisconnected(data) {
  var playerName;
  for (var i = 0; i < playersOnline.length; i++) {
    if (playersOnline[i]['playerID'] == this.id) {
      playerName = playersOnline[i]['playerName'];
      playersOnline.splice(i, 1);
      break;
    }
  }
  for (var i = 0; i < playersOnline.length; i++) {
    playersOnline[i].socket.emit('player disconnected', { playerName: playerName });
  }
  //console.log(playersOnline[0].playerName);
  //playersOnline[0].socket.emit('player disconnected', { playerName: 'test2' });
  //console.log(playersOnline);
}

function movePlayer(data) {
  db.users.update(
    { playerName: data.playerName },
    {
      $set: {
        x: data.posX,
        y: data.posY
      }
    },
    { upsert: true }
  );

  for (var i = 0; i < playersOnline.length; i++) {
    if (playersOnline[i].playerName == data.playerName) {
      playersOnline[i].posX = data.posX;
      playersOnline[i].posY = data.posY;
      playersOnline[i].rotation = data.rotation;
    }
  }
}

function sendOtherPlayersData(data) {
  var playersData = new Array();
  var playerIndex = 0;
  var toClient = this;
  for (var i = 0; i < playersOnline.length; i++) {
    if (playersOnline[i].playerID != data.playerID) {
      playersData.push( { playerName: playersOnline[i].playerName, posX: playersOnline[i].posX, posY: playersOnline[i].posY, rotation: playersOnline[i].rotation, hp: playersOnline[i].hp } );
    }
    else {

      playerIndex = i;
    }
  }
  if (playersData.length > 0) {
    this.emit('other players data', playersData);
  }
}

function playerLogin(data) {
  var statusMessage = '';
  playerFound = false;
  var toClient = this;
  console.log(data);
  db.users.findOne({ playerName: data.login, password: data.password }, function(err, foundUser) {
    if (err || !foundUser) {  
      console.log('User not in db or incorrect password');
      statusMessage = 'User not in db or incorrect password';
      console.log(data.color);
      if (data.color == "" || data.color == null) {
        var player = new Player(data.server, data.login, data.password, 50, 50, '#ffffff');
      }
      else
        var player = new Player(data.server, data.login, data.password, 50, 50, data.color);

      db.users.save(player, function(err2, savedUser2) {
        if (err2 || !savedUser2) {
          console.log("User not saved because of error" + err2);
        }
        else {
          console.log("User saved");
        }
      });
    }
    else {
      playerFound = true;
      if (data.color == "") {
        playersOnline.push( {'server': data.server, 'playerID': toClient.id, 'playerName': data.login, posX: foundUser.x, posY: foundUser.y, 'color': '#ffffff', 'socket': toClient, 'bullets': new Array(), 'rotation': 0, hp: 200 } );
      }
      else
        playersOnline.push({'server': data.server, 'playerID': toClient.id, 'playerName': data.login, posX: foundUser.x, posY: foundUser.y, 'color': data.color, 'socket': toClient, 'bullets': new Array(), 'rotation': 0, hp: 200 } );
      //playersOnline.push({'playerID': toClient.id, 'playerName': data.login, posX: foundUser.x, posY: foundUser.y, 'color': foundUser.color, 'socket': toClient, 'bullets': new Array() });
      if (data.color == "") {
        tellClient(toClient, data.login, 800, 416, '#ffffff', toClient.id);
      }
      else
        tellClient(toClient, data.login, 800, 416, data.color, toClient.id);
      //tellClient(toClient, data.login, 800, 416, foundUser.color, toClient.id);
      toClient.join(data.server);
      console.log(playersOnline);
      console.log(io.nsps['/'].adapter.rooms[data.server]);
      console.log(io.sockets.adapter.sids[toClient.id]);
      console.log('User already in db');
      //console.log(foundUser);
    }
  });
}

function tellClient(client, login, posX, posY, color, id) {
  //console.log('Found?' + playerFound);
  if (playerFound) {
    client.emit('login checked', {found: playerFound, login: login, id: id, message: ''});
    client.emit('login initial information', { posX: posX, posY: posY, color: color, hp: 200 });
  }
}

function getPlayerByName(name) {
  for (var i = 0; i < playersOnline.length; i++) {
    if (playersOnline[i].playerName == name) {
      return playersOnline[i];
    }
  }
}

init();
