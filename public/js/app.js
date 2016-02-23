/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*var Player = require('./Player').Player,
    db = require('mongojs').connect('localhost/mongogame', ['users']);

// iterate over all whose level is greater than 90. 
db.users.find({playerName: {$eq: 90}}).forEach(function (err, doc) {
  if (!doc) {
    // we visited all docs in the collection 
    return
  }
  // doc is a document in the collection 
});*/


var socket = io('http://' + window.location.hostname);
$('#app-container').hide();

/*socket.on('received rooms info', function(data) {
  for (var i = 0; i < data.length; i++) {
    $('#server-list').append('<input type="radio" name="server" value="' + data.serverName + '">' + data.serverName + '<br>');
  }
});

socket.emit('rooms info');*/

socket.on('login-failed', function(data) {
  $('#status-message').html(data.status);
});

socket.on('login checked', function(data) {
  console.log(data.found);
  console.log(data.login);
  console.log(data.id);
  $.jStorage.set('playerName', data.login);
  $.jStorage.set('server', $('input[name="server"]:checked').val());
  $.jStorage.set('playerID', data.id);
  $('.login-form').hide();
  $('#app-container').show();
  $('#app-container').css('position', 'relative');
  $('#app-container').css('left', (window.innerWidth / 2) - (parseInt($('#app-container canvas').css('width')) / 2) + 'px');
});

$(document).ready(function() {
  $('#app-container').hide();
  $('#login-button').click(function() {
    if ($('input[name="server"]:checked').val() === undefined) {
      alert('You must select a server');
    }
    else {
      socket.emit('login_data', {
        'login': $('#login').val(),
        'password': $('#password').val(),
        'server': $('input[name="server"]:checked').val(),
        'color': $("#full").val(),
      });
    }
  });

  $("#full").spectrum({
    color: "#ECC",
    showInput: true,
    className: "full-spectrum",
    showInitial: true,
    showPalette: true,
    showSelectionPalette: true,
    maxSelectionSize: 10,
    preferredFormat: "hex",
    localStorageKey: "spectrum.demo",
    move: function (color) {
        
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function () {
    
    },
    change: function() {
        
    },
    palette: [
              ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
              "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
              ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
              "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
              ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
              "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
              "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
              "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
              "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
              "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
              "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
              "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
              "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
              "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
             ]
  });
});

var player;
var bulletID = 0;
var otherPlayers = new Array();
var canAskAgain = true;
var bmd;
var bullets = new Array();
var zombies = new Array();
var bulletsSprites;
var zombieSprites;
var worldWalls;
var playerSprites;
var playerReloading = false;
var statusMessage = "";
var statusTime = 0;
//alert($.jStorage.get('playerName'));

var width = screen.width;
var height = screen.height;
var serveWidth = window.innerWidth;
var serveHeight = window.innerHeight;
var screenRatio;
var realWidth;
var realHeight;
var cursors = null;
var tiles = new Array();
var tileID = 0;
var gameWidth;
var gameHeight;
var gameTiles;
var playerMoving = false;
var y1 =  [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
           [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
           [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
           [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
           [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
           [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
           [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
           [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
           [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
           [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
           [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
           [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
           [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
           [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
           [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
           [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
           [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
           [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
           [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
           [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
           [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
           [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
           [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
           [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
           [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
           [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
           [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
var myLamp1;
var myObjs;
var holdingShoot = 0;
var timeSinceLastShot = 0;
var myLamp2;
var myMask;
var responseTime = 0;
var playerShot = false;
var timeFromLastShot = 0;
var ammoInfo;
var playerHP;
var rotationInfo;
var sounds = new Array();

//GAME STATE
var StartServer = function(game) {
}

StartServer.prototype = {
  preload: function() {
    //game.load.image('player', 'sprites/player-sprite.png');
    game.load.spritesheet('player-machine-gun', 'sprites/player-machine-gun-spritesheet.png', 80, 53, 40);
    game.load.spritesheet('zombie', 'sprites/zombie-spritesheet2.png', 64, 64, 8);
    game.load.spritesheet('blood-splash', 'sprites/dropsplash.png', 43, 56, 6);
    game.load.image('black-pixel', 'sprites/black-pixel.png');
    game.load.image('invisible-pixel', 'sprites/invisible-pixel.png');
    game.load.image('bullet', 'sprites/bullet.png');
    game.load.image('grass', 'sprites/grass.png');
    game.load.image('stone-tile', 'sprites/stone-tile.png');
    game.load.image('wall-down', 'sprites/wall-down.png');
    game.load.image('wall-right-left', 'sprites/wall-right-left.png');
    game.load.image('wall-right-corner', 'sprites/right-corner.png');
    game.load.image('world-wall-up-down', 'sprites/wall-up-down.png');
    game.load.image('world-wall-left-right', 'sprites/wall-left-right.png');
    game.load.audio('machine-gun-shot', 'sounds/machine-gun-shot.mp3');
    game.load.audio('machine-gun-reload', 'sounds/machine-gun-reload.wav');
    game.load.audio('machine-gun-no-ammo', 'sounds/machine-gun-no-ammo.mp3');
    game.load.audio('run-on-grass', 'sounds/run-on-grass.mp3');
    game.stage.backgroundColor = '#ffff';
    game.physics.startSystem(Phaser.Physics.ARCADE);
  },
  create: function() {
    this.stage.disableVisibilityChange = true;
    game.plugins.add(Phaser.Plugin.PhaserIlluminated);
    game.forceSingleUpdate = true
    game.world.setBounds(0, 0, 1600, 1600);
    for (var y = 0; y < y1.length; y++) {
      for (var x = 0; x < y1[0].length; x++) {
        if (y1[y][x] == 0) {
          tiles.push(new Floor(x * 32, y * 32, true, game.add.sprite(x * 32, y * 32, 'stone-tile')));
        }
        else if (y1[y][x] == 1) {
          tiles.push(new Floor(x * 32, y * 32, true, game.add.sprite(x * 32, y * 32, 'grass')));
        }
        tileID++;
      }
    }

    /*var myBackgroundBmd = game.add.bitmapData(1600, 1600);
    myBackgroundBmd.ctx.fillStyle = "#333333";
    myBackgroundBmd.ctx.fillRect(0, 0, 1600, 1600);
    game.cache.addBitmapData('background', myBackgroundBmd);
    var myBackgroundSprite = game.add.sprite(0, 0, myBackgroundBmd);
    myBackgroundSprite.alpha = 0.5;*/

   /* myLamp1 = game.add.illuminated.lamp(800, 416);
    //myLamp2 = game.add.illuminated.lamp(0, 0);
    var myObj = game.add.illuminated.rectangleObject(50, 50, 200, 200);
    myObjs = [myObj];
    myLamp1.createLighting(myObjs);
    //myLamp2.createLighting(myObjs);
    //var myLamps = [myLamp1, myLamp2];
    var myLamps = [myLamp1];*/

    //myMask = game.add.illuminated.darkMask(myLamps);
    //myMask = game.add.illuminated.darkMask(myLamps, '#000000');

    sounds['machine-gun-shot'] = game.add.audio('machine-gun-shot');
    sounds['machine-gun-shot'].volume = 0.05;
    sounds['machine-gun-shot'].allowMultiple = true;
    sounds['machine-gun-reload'] = game.add.audio('machine-gun-reload');
    sounds['machine-gun-reload'].allowMultiple = true;
    sounds['machine-gun-reload'].volume = 0.5
    sounds['machine-gun-no-ammo'] = game.add.audio('machine-gun-no-ammo');
    sounds['machine-gun-no-ammo'].allowMultiple = false;
    sounds['run-on-grass'] = game.add.audio('run-on-grass');
    sounds['run-on-grass'].allowMultiple = false;

    /*bmd = game.add.bitmapData(30, 30);
    bmd.ctx.beginPath();
    bmd.ctx.fillStyle = player.getColor();
    bmd.circle(15, 15, 15);
    bmd.ctx.fill();
    player.setSprite(game.add.sprite(0, 0, bmd));*/
    playerSprites = game.add.physicsGroup();
    player.setSprite(playerSprites.create(0, 0, 'player-machine-gun'));
    player.getSprite().animations.add('run-machine-gun', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], 10, true, true);
    player.getSprite().animations.add('idle-machine-gun', [1], 10, true, true);
    var reloadAnimation = player.getSprite().animations.add('reload-machine-gun', [21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39], 10, false, true);
    reloadAnimation.onComplete.add(playerReloadAnimation, this);
    player.getSprite().anchor.setTo(0.2, 0.5);
    game.physics.enable(player.getSprite(), Phaser.Physics.ARCADE);
    player.getSprite().body.collideWorldBounds = true;
    game.camera.follow(player.getSprite());
    player.getSprite().animations.play('idle-machine-gun', 5, true);
    player.getInventory().push({ weapon: 'machine gun', ammo: 150 });
    player.useWeapon('machine gun');

    ammoInfo = game.add.text(0, 0, "ammo info", { font: "bold 32px Arial", fill: "#ffffff" });
    ammoInfo.position.set(gameWidth - 100, gameHeight - 35);
    ammoInfo.fixedToCamera = true;

    statusMessage = game.add.text(gameWidth / 2, 100, "", { font: "bold 32px Arial", fill: "#ffffff" });
    statusMessage.anchor.setTo(0.5, 0.5);
    statusMessage.fixedToCamera = true;

    playerHP = game.add.text(65, gameHeight - 20, 'HP: ', { font: "bold 32px Arial", fill: "#ffffff" });
    playerHP.anchor.setTo(0.5, 0.5);
    playerHP.fixedToCamera = true;
    //rotationInfo = game.add.text(0, 50, "x y", { font: "bold 20px Arial", fill: "#ffffff" });
    //rotationInfo.fixedToCamera = true;
    

    socket.on('player disconnected', playerDisconnected);

    socket.on('player joined', playerJoined);

    socket.on('new bullet', spawnNewBullet);

    socket.on('player killed info', playerKilled);

    zombieSprites = game.add.physicsGroup();
    //socket.on('zombies coordinates', spawnZombies);

    socket.emit('succesfully logged', { server: $.jStorage.get('server'), posX: player.getX(), posY: player.getY(), playerName: player.getName(), color: player.getColor(), id: player.getID(), hp: 200 });

    socket.on('other players data', otherPlayersData);

    worldWalls = game.add.physicsGroup();
    bulletsSprites = game.add.physicsGroup();
    var wall = worldWalls.create(0, 0,'world-wall-left-right');
    wall.body.immovable = true;
    wall.body.mass = 100;
    wall = worldWalls.create(1595, 0, 'world-wall-left-right');
    wall.body.immovable = true;
    wall.body.mass = 100;
    wall = worldWalls.create(0, 0, 'world-wall-up-down');
    wall.body.immovable = true;
    wall.body.mass = 100;
    wall = worldWalls.create(90, 1595, 'world-wall-up-down');
    wall.body.immovable = true;
    wall.body.mass = 100;


    cursors = game.input.keyboard.createCursorKeys();
  },
  update: function() {
    if (player.hp <= 0) {

    }
    else {
      statusTime += game.time.elapsed;
      timeFromLastShot += game.time.elapsed;
      if (playerShot) {
        responseTime += game.time.elapsed;
      }
      if (statusTime > 5000) {
        statusMessage.text = "";
        statusTime = 0;
      }
      /*myLamp2.refresh();
      myLamp1.y += 0.5;
      myLamp2.x += 0.5;*/
      game.physics.arcade.collide(bulletsSprites, playerSprites, bulletCollidePlayers, processHandler, this)
      game.physics.arcade.collide(bulletsSprites, worldWalls, bulletCollideWalls, processHandler, this)
      game.physics.arcade.collide(zombieSprites, zombieSprites, zombieCollideZombie, processHandler, this)
      if (cursors != null) {
        player.getSprite().body.velocity.x = 0;
        player.getSprite().body.velocity.y = 0;

        var noDirection = true;
        if (cursors.left.isDown)
        {
          player.getSprite().body.velocity.x = -200;
          player.setPosition(player.getSprite().position.x, player.getSprite().position.y);
          noDirection = false;
        }
        else if (cursors.right.isDown)
        {
          player.getSprite().body.velocity.x = 200;
          player.setPosition(player.getSprite().position.x, player.getSprite().position.y);
          noDirection = false;
        }

        if (cursors.up.isDown)
        {
          player.getSprite().body.velocity.y = -200;
          player.setPosition(player.getSprite().position.x, player.getSprite().position.y);
          noDirection = false;
        }
        else if (cursors.down.isDown)
        {
          player.getSprite().body.velocity.y = 200;
          player.setPosition(player.getSprite().position.x, player.getSprite().position.y);
          noDirection = false;
        }

        if (noDirection) {
          if (!playerReloading)
            player.getSprite().animations.play('idle-machine-gun', 1, true);

          if (sounds['run-on-grass'].isPlaying) {
            sounds['run-on-grass'].stop();
          }
        }
        else {
          if (!playerReloading) {
            player.getSprite().animations.play('run-machine-gun', 5, true);
            if (!sounds['run-on-grass'].isPlaying) {
              sounds['run-on-grass'].play();
            }
          }
        }
        player.update();
        socket.emit('player move', { playerName: player.getName(), posX: player.getX(), posY: player.getY(), bullets: player.getBullets(), rotation: player.getSprite().rotation});
        if (game.input.activePointer.leftButton.isDown) {
          if (!playerReloading) {
            if (timeFromLastShot > 100) {
              if (player.getWeaponClip() == 0) {
                if (player.getEquippedWeapon().ammo != 0) {
                  holdingShoot = 0;
                  player.reloadWeapon();
                  sounds['machine-gun-reload'].play();
                  playerReloading = true;
                  player.getSprite().animations.play('reload-machine-gun', 15, false);
                }
                else {
                  sounds['machine-gun-no-ammo'].play();
                }
              }
              else {
                socket.emit('shoot gun', { server: $.jStorage.get('server'), mouseX: game.input.worldX, mouseY: game.input.worldY, speed: 500, type: 'machine gun', playerName: player.getName() });
                player.decreaseAmmo();
                holdingShoot += game.time.elapsedMS;
                timeFromLastShot = 0;
              }
            }
            playerShot = true;
          }
        }
        else {
          timeSinceLastShot += game.time.elapsedMS;
          holdingShoot = 0;
        }
        /*myLamp1.x = player.getX();
        myLamp1.y = player.getY();
        myLamp1.refresh();*/
      }
      socket.emit('send players data', { playerID: player.getID() });
      //updateZombies();
      playerHP.text = "HP: " + player.getHP();
      //ammoInfo.text = holdingShoot;
      ammoInfo.text = player.getWeaponClip() + '/' + player.getEquippedWeapon().ammo;
      //myMask.refresh();
    }
  },
  render: function() {
    //game.debug.soundInfo(sounds['run-on-grass'], 0, 100);
    //game.debug.body(player.getSprite());
    /*for (var i = 0; i < zombies.length; i++) {
      game.debug.body(zombies[i].getSprite());
    }*/
    /*for (var i = 0; i < otherPlayers.length; i++) {
      game.debug.body(otherPlayers[i].getSprite());
    }*/
    //game.debug.cameraInfo(game.camera, 32, 32);
    //game.debug.body(player.getSprite());
  }
}

var playerKilled = function(data) {
  alert('Player: ' + data.playerName + ' is DEAD');
}

var playerDisconnected = function(data) {
  for (var i = 0; i < otherPlayers.length; i++) {
    if (data.playerName == otherPlayers[i].getName()) {
      otherPlayers[i].getSprite().kill();
      otherPlayers[i].getNameObject().kill();
      otherPlayers.splice(i, 1);
      statusTime = 0;
      statusMessage.text = "Player " + data.playerName + " has disconnected";
      break;
    }
  }
}

var destroyBloodAnimation = function(animation) {
  animation.kill();
}

var playerReloadAnimation = function() {
  playerReloading = false;
}

var updateZombies = function() {
  for (var i = 0; i < zombies.length; i++) {
    zombies[i].update();
  }
}

var spawnZombies = function(data) {
  for (var i = 0; i < data.coordinates.length; i++) {
    /*var bmd2 = game.add.bitmapData(30, 30);
    bmd2.ctx.beginPath();
    bmd2.ctx.fillStyle = '#ffffff';
    bmd2.circle(15, 15, 15);
    bmd2.ctx.fill();*/

    var newZombie;
    var playerToFollow = game.rnd.integerInRange(0, otherPlayers.length + 1);
    var zombieSprite;
    if (otherPlayers.length == 0) {
      zombieSprite = zombieSprites.create(data.coordinates[i].x, data.coordinates[i].y, 'zombie');
      zombieSprite.animations.add('walk');
      zombieSprite.body.bounce.x = 0.9;
      zombieSprite.body.bounce.y = 0.9;
      newZombie = new Zombie(data.coordinates[i].x, data.coordinates[i].y, zombieSprite, 2, data.coordinates[i].type, player, game);
    }
    else {
      if (playerToFollow == otherPlayers.length + 1) {
        zombieSprite = zombieSprites.create(data.coordinates[i].x, data.coordinates[i].y, bmd2);
        zombieSprite.body.bounce.x = 0.9;
        zombieSprite.body.bounce.y = 0.9;
        newZombie = new Zombie(data.coordinates[i].x, data.coordinates[i].y, zombieSprite, 2, data.coordinates[i].type, player, game);
      }
      else {
        zombieSprite = zombieSprites.create(data.coordinates[i].x, data.coordinates[i].y, bmd2);
        zombieSprite.body.bounce.x = 0.9;
        zombieSprite.body.bounce.y = 0.9;
        newZombie = new Zombie(data.coordinates[i].x, data.coordinates[i].y, zombieSprite, 2, data.coordinates[i].type, otherPlayers[playerToFollow], game);
      }
    }
    game.physics.enable(newZombie.getSprite(), Phaser.Physics.ARCADE);
    game.physics.arcade.moveToObject(newZombie.getSprite(), newZombie.getTarget().getSprite(), 50);
    zombies.push(newZombie);
  }
  zombieSprites.forEach(function(currentZombie) {
    currentZombie.animations.play('walk', 10, true);
  }, this);
  /*console.log(data);
  console.log(zombies);
  console.log(zombieSprites);*/
}

var bulletCollidePlayers = function(bullet, hitPlayer) { 
  var bulletIndex = 0;
  for (var i = 0; i < bullets.length; i++) {
    if (bullets[i] == bullet) {
      bulletIndex = i;
    }
  }
  if (player.getSprite() == hitPlayer) {
    if (bullets[bulletIndex] !== undefined) {
      if (bullets[bulletIndex].getOwner().getName() != player.getName()) {
        var blood = game.add.image(player.getX(), player.getY(), 'blood-splash');
        blood.anchor.setTo(1, 0.5);
        blood.rotation = bullets[bulletIndex].getOwner().getSprite().rotation;
        var animation = blood.animations.add('splash', false, false);
        animation.onComplete.add(destroyBloodAnimation, this);
        blood.animations.play('splash', 10, false);
        player.setHP(player.getHP() - game.rnd.integerInRange(30, 50));
        if (player.getHP() <= 0) {
           socket.emit('player killed', { playerName: player.getName(), gun: 'machine-gun', killer: bullets[bulletIndex].getOwner().getName(), server: $.jStorage.get('server') } );
        }
      }
    }
  }
  else {
    for (var i = 0; i < otherPlayers.length; i++) {
      if (otherPlayers[i].getSprite() == hitPlayer) {
        if (bullets[bulletIndex] !== undefined) {
          if (bullets[bulletIndex].getOwner().getName() != otherPlayers[i].getName()) {
            var blood = game.add.image(otherPlayers[i].getX(), otherPlayers[i].getY(), 'blood-splash');
            blood.anchor.setTo(1, 0.5);
            blood.rotation = bullets[bulletIndex].getOwner().getSprite().rotation;
            var animation = blood.animations.add('splash', false, false);
            animation.onComplete.add(destroyBloodAnimation, this);
            blood.animations.play('splash', 10, false);
            otherPlayers[i].setHP(otherPlayers[i].getHP() - game.rnd.integerInRange(30, 50));
            if (otherPlayers[i].getHP() <= 0) {
              socket.emit('player killed', { playerName: otherPlayers[i].getName(), gun: 'machine-gun', killer: bullets[bulletIndex].getOwner().getName(), server: $.jStorage.get('server') } );
            }
            break;
          }
        }
      }
    }
  }
  bullets.splice(bulletIndex, 1);
  bullet.kill();
  hitPlayer.body.velocity.x = 0;
  hitPlayer.body.velocity.y = 0;
  return false;
}

var zombieCollideZombie = function(zombie, zombie) {

}

var bulletCollideWalls = function(bullet, sprite) {
  bullets.splice(bullet.renderOrderID, 1);
  bullet.kill();
  return true;
}


var processHandler = function(player, sprite) {
  return true;
} 

var spawnNewBullet = function(data) {
  //console.log(responseTime);
  responseTime = 0;
  sounds['machine-gun-shot'].play();
  for (var i = 0; i < otherPlayers.length; i++) {
    if (otherPlayers[i].getName() == data.owner) {
      var bulletSprite = bulletsSprites.create(otherPlayers[i].getX(), otherPlayers[i].getY(), 'bullet');
      var bullet = new Bullet(otherPlayers[i].getX(), otherPlayers[i].getY(), bulletSprite, otherPlayers[i], game);
      bulletSprite.anchor.setTo(-8, -2.5);
      bulletSprite.rotation = otherPlayers[i].getSprite().rotation;
      game.physics.enable(bullet.getSprite(), Phaser.Physics.ARCADE);
      bullet.getSprite().body.collideWorldBounds = true;
      if (holdingShoot > 100) {
        game.physics.arcade.moveToXY(bullet.getSprite(), data.mouseX + game.rnd.integerInRange(-100, 100), data.mouseY + game.rnd.integerInRange(-100, 100), 2000);
      } else if (holdingShoot > 150) {
        game.physics.arcade.moveToXY(bullet.getSprite(), data.mouseX + game.rnd.integerInRange(-150, 150), data.mouseY + game.rnd.integerInRange(-150, 150), 2000);
      } else if (holdingShoot > 200) {
        game.physics.arcade.moveToXY(bullet.getSprite(), data.mouseX + game.rnd.integerInRange(-200, 200), data.mouseY + game.rnd.integerInRange(-200, 200), 2000);
      } else if (timeSinceLastShot < 150) {
        game.physics.arcade.moveToXY(bullet.getSprite(), data.mouseX + game.rnd.integerInRange(-15, 15), data.mouseY + game.rnd.integerInRange(-15, 15), 2000);
      } else {
        game.physics.arcade.moveToXY(bullet.getSprite(), data.mouseX, data.mouseY, 2000);
      }
      timeSinceLastShot = 0;
      var renderID = bullet.getSprite().renderOrderID;
      bullets[bullet.getSprite().renderOrderID] = bullet;
      bulletID++;
    }
  }
  if (player.getName() == data.owner) {
    var bulletSprite = bulletsSprites.create(player.getX(), player.getY(), 'bullet');
    var bullet = new Bullet(player.getX(), player.getY(), bulletSprite, player, game);
    bulletSprite.anchor.setTo(-8, -2.5);
    bulletSprite.rotation = player.getSprite().rotation;
    game.physics.enable(bullet.getSprite(), Phaser.Physics.ARCADE);
    bullet.getSprite().body.collideWorldBounds = true;
    if (holdingShoot > 100) {
      game.physics.arcade.moveToXY(bullet.getSprite(), data.mouseX + game.rnd.integerInRange(-100, 100), data.mouseY + game.rnd.integerInRange(-100, 100), 2000);
    } else if (holdingShoot > 150) {
      game.physics.arcade.moveToXY(bullet.getSprite(), data.mouseX + game.rnd.integerInRange(-150, 150), data.mouseY + game.rnd.integerInRange(-150, 150), 2000);
    } else if (holdingShoot > 200) {
      game.physics.arcade.moveToXY(bullet.getSprite(), data.mouseX + game.rnd.integerInRange(-200, 200), data.mouseY + game.rnd.integerInRange(-200, 200), 2000);
    } else if (timeSinceLastShot < 150) {
      game.physics.arcade.moveToXY(bullet.getSprite(), data.mouseX + game.rnd.integerInRange(-15, 15), data.mouseY + game.rnd.integerInRange(-15, 15), 2000);
    } else {
      game.physics.arcade.moveToXY(bullet.getSprite(), data.mouseX, data.mouseY, 2000);
    }
    timeSinceLastShot = 0;
    var renderID = bullet.getSprite().renderOrderID
    bullets[bullet.getSprite().renderOrderID] = bullet;
    bulletID++;
  }
}

var playerJoined = function(data) {
  /*var bmd2 = game.add.bitmapData(100, 100);
  bmd2.ctx.beginPath();
  bmd2.ctx.fillStyle = data.color;
  bmd2.circle(50, 50, 15);
  bmd2.ctx.fill();*/

  var newPlayer = new Player(data.posX, data.posY, data.hp, null, data.playerName, data.color, '', game);
  newPlayer.setSprite(playerSprites.create(0, 0, 'player-machine-gun'));
  //newPlayer.getSprite().body.mass = 9999999;
  console.log('Player name: ' + newPlayer.getName() + ' Player HP: ' + newPlayer.getHP());
  //newPlayer.setSprite(game.add.sprite(0, 0, bmd2));

  newPlayer.getSprite().anchor.setTo(0.2, 0.5);

  otherPlayers.push(newPlayer);
}

var otherPlayersData = function(data) {
  for (var i = 0; i < data.length; i++) {
    for (var o = 0; o < otherPlayers.length; o++) {
      if (otherPlayers[o].getName() == data[i].playerName) {
        otherPlayers[o].setPosition(data[i].posX, data[i].posY);
        otherPlayers[o].getSprite().rotation = data[i].rotation;
        otherPlayers[o].update();
      }
    }
  }
}

var setSpriteAnimations = function(playerToApply) {
  /*playerToApply.getSprite().animations.add('standLeft', [6], 20);
  playerToApply.getSprite().animations.add('standUp', [0], 20);
  playerToApply.getSprite().animations.add('standRight', [3], 20);
  playerToApply.getSprite().animations.add('standDown', [9], 20);
  playerToApply.getSprite().animations.add('walkLeft', [7, 8], 5, false).onComplete.add(function(sprite, animation) {
    animation.stop();
    playerMoving = false;
    playerToApply.getSprite().play('standLeft');
  }, this);
  playerToApply.getSprite().animations.add('walkRight', [4, 5], 5, false).onComplete.add(function(sprite, animation) {
    animation.stop();
    playerMoving = false;
    playerToApply.getSprite().play('standRight');
  }, this);
  playerToApply.getSprite().animations.add('walkDown', [10, 11], 5, false).onComplete.add(function(sprite, animation) {
    animation.stop();
    playerMoving = false;
    playerToApply.getSprite().play('standDown');
  }, this);
  playerToApply.getSprite().animations.add('walkUp', [1, 2], 5, false).onComplete.add(function(sprite, animation) {
    animation.stop();
    playerMoving = false;
    playerToApply.getSprite().play('standUp');
  }, this);*/
}

game = new Phaser.Game(serveWidth / 1.5, serveHeight / 1.08, Phaser.AUTO, 'app-container');
gameWidth = serveWidth / 1.5;
gameHeight = serveHeight / 1.08;
game.state.add('StartServer', StartServer);

socket.on('login initial information', function(data) {
  console.log(data);
  player = new Player(data.posX, data.posY, data.hp, null, $.jStorage.get('playerName'), data.color ,$.jStorage.get('playerID'), game);
  console.log('Player name: ' + player.getName() + ' Player HP: ' + player.getHP());
  game.state.start('StartServer');
});