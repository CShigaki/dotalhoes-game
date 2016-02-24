// Connects to the server,
var socket = io('http://' + window.location.hostname);

/*socket.on('received rooms info', function(data) {
  for (var i = 0; i < data.length; i++) {
    $('#server-list').append('<input type="radio" name="server" value="' + data.serverName + '">' + data.serverName + '<br>');
  }
});

socket.emit('rooms info');*/

// If the login failed.
socket.on('login-failed', function(data) {
  // Sets the appropriate status message.
  $('#status-message').html(data.status);
});

// The player logged in succesfully
socket.on('login checked', function(data) {
  console.log(data.found);
  console.log(data.login);
  console.log(data.id);
  // Data from the login is stored.
  $.jStorage.set('playerName', data.login);
  $.jStorage.set('server', $('input[name="server"]:checked').val());
  $.jStorage.set('playerID', data.id);
  // Hides the login form.
  $('.login-form').hide();
  // And shows the game container.
  $('#app-container').show();
  $('#app-container').css('position', 'relative');
  // Position the container in the screen.
  $('#app-container').css('left', (window.innerWidth / 2) - (parseInt($('#app-container canvas').css('width')) / 2) + 'px');
});

$(document).ready(function() {
  // Hides the div where the game will be rendered.
  $('#app-container').hide();
  $('#login-button').click(function() {
    if ($('input[name="server"]:checked').val() === undefined) {
      alert('You must select a server');
    }
    else {
      // Sends the login information to the server.
      socket.emit('login_data', {
        'login': $('#login').val(),
        'password': $('#password').val(),
        'server': $('input[name="server"]:checked').val(),
        'color': $("#full").val(),
      });
    }
  });

  // The color picker plugin.
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

// The player variable.
var player;
// Array with other players.
var otherPlayers = new Array();
// All the bullets are stored here.
var bullets = new Array();
// Not being used. The array that used to store the zombies
var zombies = new Array();
// All the tiles are stored here.
var tiles = new Array();
var tileID = 0;
var canAskAgain = true;
var bmd;
// Groups where all the sprites will be created.
var bulletsSprites;
var zombieSprites;
var worldWalls;
var playerSprites;
// If the player is realoading, does not do any other animation.
var playerReloading = false;
// Screen size related variables.
var serveWidth = window.innerWidth;
var serveHeight = window.innerHeight;
var realWidth;
var realHeight;
var cursors = null;
var gameWidth;
var gameHeight;
// How long is the player holding the shoot button.
var holdingShoot = 0;
// Prevent precise shots when clicking constantly.
var timeSinceLastShot = 0;
// Light related variables.
var myLamp2;
var myMask;
var myLamp1;
var myObjs;
// Rate of fire. Controls the speed at which the gun shoots.
var timeFromLastShot = 0;

// Text variables.
var statusTime;
var statusMessage;
var ammoInfo;
var playerHP;
var rotationInfo;

// Sounds array. All the sounds are stored here.
var sounds = new Array();

// The map.
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

// Start game state (Needs renaming)
var StartServer = function(game) {
}

StartServer.prototype = {
  preload: function() {
    // Loads all the assets.
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
    // Starts the physics system.
    game.physics.startSystem(Phaser.Physics.ARCADE);
  },
  create: function() {
    // Prevents the game from stopping when the renderer loses focus.
    this.stage.disableVisibilityChange = true;
    // Adds the light lib.
    game.plugins.add(Phaser.Plugin.PhaserIlluminated);
    // Creates the world bounds.
    game.world.setBounds(0, 0, 1600, 1600);
    // This for will create the tiles.
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

    // Creates the lamps. See http://www.html5gamedevs.com/topic/17236-phaser-illuminatedjs-interface-library/.
    myLamp1 = game.add.illuminated.lamp(800, 416);
    //myLamp2 = game.add.illuminated.lamp(0, 0);
    var myObj = game.add.illuminated.rectangleObject(50, 50, 200, 200);
    myObjs = [myObj];
    myLamp1.createLighting(myObjs);
    //myLamp2.createLighting(myObjs);
    //var myLamps = [myLamp1, myLamp2];
    var myLamps = [myLamp1];

    //myMask = game.add.illuminated.darkMask(myLamps);
    myMask = game.add.illuminated.darkMask(myLamps, '#000000');

    // Loads all the audios and set some variables for them
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

    // Creates the group for the players sprites.
    playerSprites = game.add.physicsGroup();
    // Sets the player sprite.
    player.setSprite(playerSprites.create(0, 0, 'player-machine-gun'));
    player.getSprite().anchor.setTo(0.2, 0.5);
    player.getSprite().body.collideWorldBounds = true;
    game.physics.enable(player.getSprite(), Phaser.Physics.ARCADE);
    game.camera.follow(player.getSprite());
    // And adds the animations.
    player.getSprite().animations.add('run-machine-gun', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], 10, true, true);
    player.getSprite().animations.add('idle-machine-gun', [1], 10, true, true);
    var reloadAnimation = player.getSprite().animations.add('reload-machine-gun', [21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39], 10, false, true);
    reloadAnimation.onComplete.add(playerReloadAnimation, this);
    // Plays the idle animation.
    player.getSprite().animations.play('idle-machine-gun', 5, true);
    // Adds a machine gun to the player inventory.
    player.getInventory().push({ weapon: 'machine gun', ammo: 150 });
    // And tells the player to use it.
    player.useWeapon('machine gun');

    // Creates text to be shown in the screen.
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

    // Creates possible oevents the server can send to the client.
    socket.on('player disconnected', playerDisconnected);

    socket.on('player joined', playerJoined);

    socket.on('new bullet', spawnNewBullet);

    socket.on('player killed info', playerKilled);

    //zombieSprites = game.add.physicsGroup();
    //socket.on('zombies coordinates', spawnZombies);

    socket.emit('succesfully logged', { server: $.jStorage.get('server'), posX: player.getX(), posY: player.getY(), playerName: player.getName(), color: player.getColor(), id: player.getID(), hp: 200 });

    socket.on('other players data', otherPlayersData);

    // Creates the bullet and world groups.
    worldWalls = game.add.physicsGroup();
    bulletsSprites = game.add.physicsGroup();
    // Creates the world walls. The walls are immovable and unaffected by force.
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
    // Used to get input.
    cursors = game.input.keyboard.createCursorKeys();
  },
  update: function() {
    // Execute the update only if the player hp is gt 0.
    if (player.hp <= 0) {

    }
    else {
      statusTime += game.time.elapsed;
      timeFromLastShot += game.time.elapsed;
      if (statusTime > 5000) {
        // This is counter is used to time the 'player x disconnected message'.
        statusMessage.text = "";
        statusTime = 0;
      }

      /*myLamp2.refresh();
      myLamp1.y += 0.5;
      myLamp2.x += 0.5;*/

      // Check for collisions.
      game.physics.arcade.collide(bulletsSprites, playerSprites, bulletCollidePlayers, processHandler, this)
      game.physics.arcade.collide(bulletsSprites, worldWalls, bulletCollideWalls, processHandler, this)
      game.physics.arcade.collide(zombieSprites, zombieSprites, zombieCollideZombie, processHandler, this)
      if (cursors != null) {
        // Zeroes the velocity in the player body.
        player.getSprite().body.velocity.x = 0;
        player.getSprite().body.velocity.y = 0;
        var noDirection = true;

        // Check if the player is pressing left or right.
        if (cursors.left.isDown) {
          player.getSprite().body.velocity.x = -200;
          player.setPosition(player.getSprite().position.x, player.getSprite().position.y);
          noDirection = false;
        } else if (cursors.right.isDown) {
          player.getSprite().body.velocity.x = 200;
          player.setPosition(player.getSprite().position.x, player.getSprite().position.y);
          noDirection = false;
        }

        // Check if the player is pressing up or down.
        if (cursors.up.isDown) {
          player.getSprite().body.velocity.y = -200;
          player.setPosition(player.getSprite().position.x, player.getSprite().position.y);
          noDirection = false;
        } else if (cursors.down.isDown) {
          player.getSprite().body.velocity.y = 200;
          player.setPosition(player.getSprite().position.x, player.getSprite().position.y);
          noDirection = false;
        }

        // If the player is not moving
        if (noDirection) {
          if (!playerReloading)
            player.getSprite().animations.play('idle-machine-gun', 1, true);

          // Stop the 'running on grass sound effect'
          if (sounds['run-on-grass'].isPlaying) {
            sounds['run-on-grass'].stop();
          }
        }
        else {
          // If the player is not reloading, execute the running animation.
          if (!playerReloading) {
            player.getSprite().animations.play('run-machine-gun', 5, true);
            if (!sounds['run-on-grass'].isPlaying) {
              sounds['run-on-grass'].play();
            }
          }
        }
        // Updates the player info.
        player.update();
        socket.emit('player move', { playerName: player.getName(), posX: player.getX(), posY: player.getY(), bullets: player.getBullets(), rotation: player.getSprite().rotation});
        if (game.input.activePointer.leftButton.isDown) {
          // If the player is shooting.
          if (!playerReloading) {
            // timeFromLastShot is used for rate of fire.
            if (timeFromLastShot > 100) {
              if (player.getWeaponClip() == 0) {
                if (player.getEquippedWeapon().ammo != 0) {
                  // Reload the weapon if there is still ammo and the clip is empty.
                  holdingShoot = 0;
                  player.reloadWeapon();
                  sounds['machine-gun-reload'].play();
                  playerReloading = true;
                  player.getSprite().animations.play('reload-machine-gun', 15, false);
                }
                else {
                  // If there is no ammo, play the 'no ammo' sound.
                  sounds['machine-gun-no-ammo'].play();
                }
              }
              else {
                // Emit the event telling that the player shot.
                socket.emit('shoot gun', { server: $.jStorage.get('server'), mouseX: game.input.worldX, mouseY: game.input.worldY, speed: 500, type: 'machine gun', playerName: player.getName() });
                // Decrease the ammo.
                player.decreaseAmmo();
                // Time the player is holding the shoot button. This is used to make the direction of the shots differ.
                holdingShoot += game.time.elapsedMS;
                timeFromLastShot = 0;
              }
            }
          }
        }
        else {
          timeSinceLastShot += game.time.elapsedMS;
          holdingShoot = 0;
        }
        // Update the lamps. (light related).
        myLamp1.x = player.getX();
        myLamp1.y = player.getY();
        myLamp1.refresh();
      }
      // Only ask for other players informations when the last request has been completed.
      if (canAskAgain) {
        // Sends the played id, so the server only sends info about the other players.
        socket.emit('send players data', { playerID: player.getID() });
      }
      //updateZombies();
      // Prints the player's current hp.
      playerHP.text = "HP: " + player.getHP();
      //ammoInfo.text = holdingShoot;
      // Prints the amount of bullets in the clip and the total of bullets.
      ammoInfo.text = player.getWeaponClip() + '/' + player.getEquippedWeapon().ammo;
      myMask.refresh();
    }
  },
  render: function() {
    // Debug comments. I frequently need them so I just leave them commented.

    //game.debug.soundInfo(sounds['run-on-grass'], 0, 100);
    //game.debug.body(player.getSprite());
    //for (var i = 0; i < zombies.length; i++) {
    //  game.debug.body(zombies[i].getSprite());
    //}
    //for (var i = 0; i < otherPlayers.length; i++) {
    //  game.debug.body(otherPlayers[i].getSprite());
    //}
    //game.debug.cameraInfo(game.camera, 32, 32);
    //game.debug.body(player.getSprite());
  }
}

// Callback for the player killed event
var playerKilled = function(data) {
  alert('Player: ' + data.playerName + ' is DEAD');
}

// Callback for when a is disconnected.
var playerDisconnected = function(data) {
  for (var i = 0; i < otherPlayers.length; i++) {
    if (data.playerName == otherPlayers[i].getName()) {
      // Kill the player sprite and the name.
      otherPlayers[i].getSprite().kill();
      otherPlayers[i].getNameObject().kill();
      // Remove him from the otherPlayers array.
      otherPlayers.splice(i, 1);
      statusTime = 0;
      // And sets the status message.
      statusMessage.text = "Player " + data.playerName + " has disconnected";
      break;
    }
  }
}

// Destroy the blood animation when a payeris hit.
var destroyBloodAnimation = function(animation) {
  animation.kill();
}

// The reload animation has ended.
var playerReloadAnimation = function() {
  playerReloading = false;
}

// When the game still had zombies.
var updateZombies = function() {
  for (var i = 0; i < zombies.length; i++) {
    zombies[i].update();
  }
}

// This functions will create the zombies and make them follow a random online player.
var spawnZombies = function(data) {
  for (var i = 0; i < data.coordinates.length; i++) {
    // Zombies used to be just a white circle.
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
}

// Bullet collides with player.
var bulletCollidePlayers = function(bullet, hitPlayer) { 
  var bulletIndex = 0;
  for (var i = 0; i < bullets.length; i++) {
    if (bullets[i] == bullet) {
      bulletIndex = i;
    }
  }
  if (player.getSprite() == hitPlayer) {
    if (bullets[bulletIndex] !== undefined) {
      // There are some cases where the player collide with it's on bullet.
      if (bullets[bulletIndex].getOwner().getName() != player.getName()) {
        // If it's an enemy bullet.
        // Create the blood sprite, add the animations and position it.
        var blood = game.add.image(player.getX(), player.getY(), 'blood-splash');
        blood.anchor.setTo(1, 0.5);
        blood.rotation = bullets[bulletIndex].getOwner().getSprite().rotation;
        var animation = blood.animations.add('splash', false, false);
        animation.onComplete.add(destroyBloodAnimation, this);
        blood.animations.play('splash', 10, false);
        // Reduce the player hp randomly. Different damages depending on weapon have not been implemented yet.
        player.setHP(player.getHP() - game.rnd.integerInRange(30, 50));
        if (player.getHP() <= 0) {
          // If the player is dead, tell the server.
           socket.emit('player killed', { playerName: player.getName(), gun: 'machine-gun', killer: bullets[bulletIndex].getOwner().getName(), server: $.jStorage.get('server') } );
        }
      }
    }
  }
  else {
    // If the current player was not hit. Another plaer was, instead,
    for (var i = 0; i < otherPlayers.length; i++) {
      if (otherPlayers[i].getSprite() == hitPlayer) {
        if (bullets[bulletIndex] !== undefined) {
          if (bullets[bulletIndex].getOwner().getName() != otherPlayers[i].getName()) {
            // Same as the other case.
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
  // Kills the bullet and remove the force applied to the body by the bullet.
  bullets.splice(bulletIndex, 1);
  bullet.kill();
  hitPlayer.body.velocity.x = 0;
  hitPlayer.body.velocity.y = 0;
  return false;
}

var zombieCollideZombie = function(zombie, zombie) {

}

// Remove the bullet case it hits the world walls.
var bulletCollideWalls = function(bullet, sprite) {
  bullets.splice(bullet.renderOrderID, 1);
  bullet.kill();
  return true;
}


var processHandler = function(player, sprite) {
  return true;
} 

// Server sent a message to spawn a bullet. 
var spawnNewBullet = function(data) {
  // Play the sound
  sounds['machine-gun-shot'].play();
  for (var i = 0; i < otherPlayers.length; i++) {
    if (otherPlayers[i].getName() == data.owner) {
      // Creates the bullet sprite in the bullet group.
      var bulletSprite = bulletsSprites.create(otherPlayers[i].getX(), otherPlayers[i].getY(), 'bullet');
      var bullet = new Bullet(otherPlayers[i].getX(), otherPlayers[i].getY(), bulletSprite, otherPlayers[i], game);
      // Position it.
      bulletSprite.anchor.setTo(-8, -2.5);
      bulletSprite.rotation = otherPlayers[i].getSprite().rotation;
      // Enables the physics for the bullet.
      game.physics.enable(bullet.getSprite(), Phaser.Physics.ARCADE);
      bullet.getSprite().body.collideWorldBounds = true;
      // Accuracy depending on the time pressing the shoot button. There's 3 variations for the accuracy.
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
    }
  }
  if (player.getName() == data.owner) {
    // There's 2 ifs because the player is not in the same array as the other players, but the logic is the same.
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
  }
}

// A player has joined the server. Create it's sprite and position it. There's no other players animation yet.
var playerJoined = function(data) {
  var newPlayer = new Player(data.posX, data.posY, data.hp, null, data.playerName, data.color, '', game);
  newPlayer.setSprite(playerSprites.create(0, 0, 'player-machine-gun'));
  console.log('Player name: ' + newPlayer.getName() + ' Player HP: ' + newPlayer.getHP());

  newPlayer.getSprite().anchor.setTo(0.2, 0.5);

  otherPlayers.push(newPlayer);
}

// Gets data from other players. This is sent by the server whenever the player asks, on every update.
var otherPlayersData = function(data) {
  for (var i = 0; i < data.length; i++) {
    for (var o = 0; o < otherPlayers.length; o++) {
      if (otherPlayers[o].getName() == data[i].playerName) {
        // Position and rotate the other players sprites.
        otherPlayers[o].setPosition(data[i].posX, data[i].posY);
        otherPlayers[o].getSprite().rotation = data[i].rotation;
        otherPlayers[o].update();
      }
    }
  }
}

// Phaser will use #app-container to render the game.
game = new Phaser.Game(serveWidth / 1.5, serveHeight / 1.08, Phaser.AUTO, 'app-container');
gameWidth = serveWidth / 1.5;
gameHeight = serveHeight / 1.08;
// StartServer State.
game.state.add('StartServer', StartServer);

// Initial information for the creation and positioning of the player.
socket.on('login initial information', function(data) {
  console.log(data);
  player = new Player(data.posX, data.posY, data.hp, null, $.jStorage.get('playerName'), data.color ,$.jStorage.get('playerID'), game);
  console.log('Player name: ' + player.getName() + ' Player HP: ' + player.getHP());
  game.state.start('StartServer');
});