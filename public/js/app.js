// Connects to the server,
var socket = io('http://' + window.location.hostname);

// When the page finishes loading.
$(document).ready(function() {
  // Sends the login information to the server.
  socket.emit('player-login', {
              'login': $('#login').val(),
              'password': $('#password').val()});
});


/*
 *  Global socket messages
 */

// If the login failed.
socket.on('login-failed', function(data) {
  // Sets the appropriate status message.
  $('#status-message').html(data.status);
});

// The player logged in succesfully
socket.on('login-checked', function(data) {
  // Data from the login is stored.
  $.jStorage.set('playerName', data.login);
  $.jStorage.set('playerID', data.id);
  $.jStorage.set('server', $('input[name="server"]:checked').val());

  // And shows the game container.
  $('#app-container').css('position', 'relative');
  // Position the container in the screen.
  $('#app-container').css('left', (window.innerWidth / 2) - (parseInt($('#app-container canvas').css('width')) / 2) + 'px');
});



var GAME_SCREEN_SIZE = {"w": window.innerWidth / 1.5,
                        "h": window.innerHeight / 1.8}

// Phaser will use #app-container to render the game.
var game = new Phaser.Game(GAME_SCREEN_SIZE.w, GAME_SCREEN_SIZE.h, Phaser.AUTO, 'app-container');

// Start game state
var TheGame = function(game) {this.game = game;
  // The map.
  // TODO: Generate map dinamically, or make more maps to justify drawing by hand
  this.map = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
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

  // Sound array
  this.sounds = new Array();

  this.player = null;
  this.players = new Array();
  this.playerSprites = new Array();
  this.cursors = null;
  this.tiles = new Array();
  this.update_player_conter = 100;
}

TheGame.prototype = {
  preload: function() {
    // Loads all the assets.

    // Sprites
    this.game.load.spritesheet('player-machine-gun', 'sprites/player-machine-gun-spritesheet.png', 80, 53, 40);
    this.game.load.spritesheet('zombie', 'sprites/zombie-spritesheet2.png', 64, 64, 8);
    this.game.load.spritesheet('blood-splash', 'sprites/dropsplash.png', 43, 56, 6);

    // Images
    this.game.load.image('black-pixel', 'sprites/black-pixel.png');
    this.game.load.image('invisible-pixel', 'sprites/invisible-pixel.png');
    this.game.load.image('bullet', 'sprites/bullet.png');
    this.game.load.image('grass', 'sprites/grass.png');
    this.game.load.image('stone-tile', 'sprites/stone-tile.png');
    this.game.load.image('wall-down', 'sprites/wall-down.png');
    this.game.load.image('wall-right-left', 'sprites/wall-right-left.png');
    this.game.load.image('wall-right-corner', 'sprites/right-corner.png');
    this.game.load.image('world-wall-up-down', 'sprites/wall-up-down.png');
    this.game.load.image('world-wall-left-right', 'sprites/wall-left-right.png');

    // Sounds
    this.game.load.audio('machine-gun-shot', 'sounds/machine-gun-shot.mp3');
    this.game.load.audio('machine-gun-reload', 'sounds/machine-gun-reload.wav');
    this.game.load.audio('machine-gun-no-ammo', 'sounds/machine-gun-no-ammo.mp3');
    this.game.load.audio('run-on-grass', 'sounds/run-on-grass.mp3');

    // Other
    this.game.stage.backgroundColor = '#ffff';

    // Starts the physics system.
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  },

  createMap: function() {
    // This for will create the tiles.
    var rows = this.map.length;
    var collumns = this.map[0].length;
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < collumns; x++) {
        if (this.map[y][x] == 0) {
          this.tiles.push(new Floor(x * 32, y * 32, true, this.game.add.sprite(x * 32, y * 32, 'stone-tile')));
        }
        else if (this.map[y][x] == 1) {
          this.tiles.push(new Floor(x * 32, y * 32, true, this.game.add.sprite(x * 32, y * 32, 'grass')));
        }
      }
    }
  },

  // New Player joined the room
  playerJoined: function(data, self) {
    if (data.player.id == self.player.id) {
      return;
    }
    console.log(data.player.name);
    console.log("playerJoined");
    var player_sprite = self.playerSprites.create(0, 0, 'player-machine-gun');
    self.game.physics.enable(player_sprite, Phaser.Physics.ARCADE);
    player_sprite.anchor.setTo(0.2, 0.5);
    player_sprite.body.collideWorldBounds = true;
    var player = new Player(data.player.id,
                            data.player.name,
                            data.player.color,
                            data.player.position,
                            data.player.rotation,
                            player_sprite,
                            self.game);
    self.players.push(player);
  },

  playerDisconnected: function(data, self) {
    var n_of_players = self.players.length;
    for (var i = 0; i < n_of_players; i++) {
      if (data.name == self.players[i].name) {
        self.players[i].sprite.kill();
        self.players.splice(i, 1);
        break;
      }
    }
  },

  updatePlayers: function(data, self) {
    var n_of_players = self.players.length;
    for (var player of data) {
      if (n_of_players == 0) {
        if (player.id != this.player.id) {
          var player_sprite = self.playerSprites.create(0, 0, 'player-machine-gun');
          self.game.physics.enable(player_sprite, Phaser.Physics.ARCADE);
          player_sprite.anchor.setTo(0.2, 0.5);
          player_sprite.body.collideWorldBounds = true;
          self.players.push(new Player(player.id,
                                       player.name,
                                       player.color,
                                       player.position,
                                       player.rotation,
                                       player_sprite,
                                       self.game));
        }
      } else {
        for (var i = 0; i < n_of_players; i++) {
          if (self.players[i].id == player.id) {
            // Position and rotate the other players sprites.
            self.players[i].position = player.position;
            self.players[i].sprite.rotation = player.rotation;
            self.players[i].update();
          }
        }
      }
    }
  },

  create: function() {
    // Prevents the game from stopping when the renderer loses focus.
    this.stage.disableVisibilityChange = true;

    // Creates the world bounds.
    // TODO: put limits in a constant
    game.world.setBounds(0, 0, 1600, 1600);

    this.createMap();

    // Loads all the audios and set some variables for them
    this.sounds['machine-gun-shot'] = this.game.add.audio('machine-gun-shot');
    this.sounds['machine-gun-shot'].volume = 0.05;
    this.sounds['machine-gun-shot'].allowMultiple = true;
    this.sounds['machine-gun-reload'] = this.game.add.audio('machine-gun-reload');
    this.sounds['machine-gun-reload'].allowMultiple = true;
    this.sounds['machine-gun-reload'].volume = 0.5
    this.sounds['machine-gun-no-ammo'] = this.game.add.audio('machine-gun-no-ammo');
    this.sounds['machine-gun-no-ammo'].allowMultiple = false;
    this.sounds['run-on-grass'] = this.game.add.audio('run-on-grass');
    this.sounds['run-on-grass'].allowMultiple = false;

    // Creates the group for the players sprites.
    this.playerSprites = this.game.add.physicsGroup();

    player_sprite = this.playerSprites.create(0, 0, 'player-machine-gun');
    this.game.physics.enable(player_sprite, Phaser.Physics.ARCADE);

    this.player = new Player($.jStorage.get('playerID'),
                             $.jStorage.get('playerName'),
                             "#ffff",
                             {'x': 200, 'y': 200},
                             player_sprite.rotation,
                             player_sprite,
                             game);

    // Sets the player sprite.
    this.player.sprite.anchor.setTo(0.2, 0.5);
    this.player.sprite.body.collideWorldBounds = true;
    this.player.sprite.rotation = game.physics.arcade.angleToPointer(this.player.sprite);

    this.game.camera.follow(this.player.sprite);

    // And adds the animations.
    this.player.sprite.animations.add('run-machine-gun', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], 10, true, true);
    this.player.sprite.animations.add('idle-machine-gun', [1], 10, true, true);

    // Plays the idle animation.
    this.player.sprite.animations.play('idle-machine-gun', 5, true);

    // Adds a machine gun to the player inventory.
    // TODO: Create class Weapon
    this.player.weapons.push({ weapon: 'machine gun', ammo: 150 });

    playerHP = this.game.add.text(65, GAME_SCREEN_SIZE.h - 20, 'HP: ', { font: "bold 32px Arial", fill: "#ffffff" });
    playerHP.anchor.setTo(0.5, 0.5);
    playerHP.fixedToCamera = true;

    // Creates possible events the server can send to the client.
    var self = this; // To use this inside socket.on callback
    socket.on('player-disconnected', function(data) {self.playerDisconnected(data, self)});
    socket.on('player-joined-room', function(data) {self.playerJoined(data, self)});
    socket.on('players-data', function(data) {self.updatePlayers(data, self)});

    // Initial information for the creation and positioning of the player.

    // TODO Create this dinammicaly, based in the map
    worldWalls = this.game.add.physicsGroup();
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

    // Creates the bullet.
    bulletsSprites = this.game.add.physicsGroup();

    // Used to get input.
    this.cursors = game.input.keyboard.createCursorKeys();

    socket.emit('player-join', {"server": $.jStorage.get('server'),
                                "player": this.player.serverInfo()});
  },

  update: function() {
    // Execute the update only if the player hp is gt 0.
    if (this.player.hp >= 0) {

      // Zeroes the velocity in the player body.
      this.player.sprite.body.velocity.x = 0;
      this.player.sprite.body.velocity.y = 0;
      var noDirection = true;

      if (this.cursors.left.isDown) {
        this.player.sprite.body.velocity.x = -200;
        noDirection = false;
      } else if (this.cursors.right.isDown) {
        this.player.sprite.body.velocity.x = 200;
        noDirection = false;
      }
      if (this.cursors.up.isDown) {
        this.player.sprite.body.velocity.y = -200;
        noDirection = false;
      } else if (this.cursors.down.isDown) {
        this.player.sprite.body.velocity.y = 200;
        noDirection = false;
      }

      this.player.position = this.player.sprite.position;
      this.player.sprite.rotation = game.physics.arcade.angleToPointer(this.player.sprite);

      // Updates the player info.
      this.player.update();
      socket.emit('player-move', { "id": this.player.id,
                                   "name": this.player.name,
                                   "position": this.player.position,
                                   "rotation": this.player.sprite.rotation});

      // Prints the player's current hp.
      playerHP.text = "HP: " + this.player.hp;
    }

    socket.emit('players-data');
  },
  render: function() {
    // Debug comments. I frequently need them so I just leave them commented.

    //game.debug.soundInfo(sounds['run-on-grass'], 0, 100);
    //game.debug.body(player.sprite);
    //for (var i = 0; i < zombies.length; i++) {
    //  game.debug.body(zombies[i].sprite);
    //}
    //for (var i = 0; i < otherPlayers.length; i++) {
    //  game.debug.body(otherPlayers[i].sprite);
    //}
    //game.debug.cameraInfo(game.camera, 32, 32);
    //game.debug.body(player.sprite);
  }
}

// Gets data from other players. This is sent by the server whenever the player asks, on every update.

// TheGame State.
game.state.add('TheGame', TheGame);

socket.on('start-game', function(data) {
  game.state.start('TheGame');
});
