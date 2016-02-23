var Player = function(server, playerName, password, startX, startY, color) {
  this.x = startX;
  this.y = startY;
  this.playerName = playerName;
  this.password = password;
  this.server = server;
  this.color = color;

  this.getServer = function() {
    return this.server;
  }

  this.setServer = function(server) {
    this.server = server;
  }

  this.getX = function() {
    return this.x;
  }

  this.getY = function() {
    return this.y;
  }

  this.setX = function() {
    return this.x;
  }

  this.setY = function() {
    return this.y;
  }

  this.getName = function() {
    return this.playerName;
  }

  this.getColor = function() {
    return this.color;
  }

  this.setColor = function(color) {
    this.color = color;
  }
}

exports.Player = Player;
