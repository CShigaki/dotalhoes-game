var DEFAULT_BULLET_SIZE = {"w": 5, "h": 5}

var Bullet = function(position, sprite, owner, game) {
  // Call parent class constructor
  GameObject.call(this, position, sprite, false, DEFAULT_BULLET_SIZE, false, true);

  this.owner = owner;
  this.game = game;
}

// Bullet inherit from GameObject
Bullet.prototype = Object.create(GameObject.prototype);
