var Bullet = function(startX, startY, sprite, owner, game) {
  this.position = { x: startX, y: startY };
  this.sprite = sprite;
  this.owner = owner;
  this.game = game;

  this.setPosition = function(x, y) {
    this.position.x = x;
    this.position.y = y;
    this.sprite.position.x = this.position.x;
    this.sprite.position.y = this.position.y;
  }

  this.getPosition = function() {
    return this.position;
  }

  this.getX = function() {
    return this.position.x;
  }

  this.getY = function() {
    return this.position.y;
  }

  this.getOwner = function() {
    return this.owner;
  }

  this.getSprite = function() {
    return this.sprite;
  }
}