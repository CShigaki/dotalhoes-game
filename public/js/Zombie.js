var Zombie = function(startX, startY, sprite, hp, type, target, game) {
  this.position = {x: startX, y: startY};
  this.sprite = sprite;
  this.game = game;
  this.hp = hp;
  this.type = type;
  this.target = target;

  this.getX = function() {
    return this.position.x;
  }

  this.getY = function() {
    return this.position.y;
  }

  this.getTarget = function() {
    return this.target;
  }

  this.setTarget = function(target) {
    this.target = target;
  }

  this.setHp = function(hp) {
    this.hp = hp;
  }

  this.getHp = function() {
    return this.hp;
  }

  this.decreaseOneHP = function() {
    this.hp -= 1;
    return this.hp;
  }

  this.getType = function() {
    return this.type;
  }

  this.setType = function(type) {
    this.type = type;
  }

  this.getPosition = function() {
    return this.position;
  }

  this.setPosition = function(x, y) {
    this.position.x = x;
    this.position.y = y;
  }

  this.getSprite = function() {
    return this.sprite;
  }

  this.update = function() {
    game.physics.arcade.moveToObject(this.getSprite(), this.getTarget().getSprite(), 50);
    //var rotation = game.physics.arcade.angleBetween(this.getSprite(), this.getTarget().getSprite());
    //this.getSprite().rotation = -rotation;

    this.getSprite().rotation = game.physics.arcade.angleToXY(this.getSprite(), this.getTarget().getX(), this.getTarget().getY());

    //var rotation = Phaser.Point.angle(this.getSprite().position, this.getTarget().getSprite().position);
    //this.getSprite().rotation = rotation;
    //this.sprite.position.set(this.getX(), this.getY());
  }

  this.setSprite = function(sprite) {
    this.sprite = sprite;
  }
}

