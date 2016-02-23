var Player = function(startX, startY, hp, sprite, playerName, color, id, game) {
  this.position = {x: startX, y: startY};
  this.hp = hp;
  this.playerName = playerName;
  this.id = id;
  this.sprite = sprite;
  this.game = game;
  this.playerNameObject = this.game.add.text(this.position.x * 32, this.position.y * 32 - 35, this.playerName, {font: '20px Impact', fill: '#fff', align: 'center'});
  this.playerNameObject.anchor.set(0.5);
  this.bullets = new Array();
  this.color = color;
  this.weapons = new Array();
  this.currentWeapon;
  this.weaponClip;

  this.useWeapon = function(name) {
    for (var i = 0; i < this.weapons.length; i++) {
      if (this.weapons[i].weapon == 'machine gun') {
        this.currentWeapon = this.weapons[i];
        this.weaponClip = 30;
      }
    }
  }

  this.reloadWeapon = function() {
    if (this.currentWeapon.weapon == 'machine gun') {
      this.currentWeapon.ammo -= 30;
      this.weaponClip = 30;
    }
  }

  this.getHP = function() {
    return this.hp;
  }

  this.setHP = function(hp) {
    this.hp = hp
  }

  this.getNameObject = function() {
    return this.playerNameObject;
  }

  this.getWeaponClip = function() {
    return this.weaponClip;
  }

  this.decreaseAmmo = function() {
    this.weaponClip--;
  }

  this.isAlive = function() {
    if (this.getHP() <= 0) {
      return false
    }
    else {
      return true;
    }
  }

  this.getEquippedWeapon = function() {
    return this.currentWeapon;
  }

  this.getInventory = function() {
    return this.weapons;
  }

  this.getX = function() {
    return this.position.x;
  }

  this.getY = function() {
    return this.position.y;
  }

  this.getPosition = function() {
    return this.position;
  }

  this.setPosition = function(x, y) {
    this.position.x = x;
    this.position.y = y;
  }

  this.getName = function() {
    return this.playerName;
  }

  this.getID = function() {
    return this.id;
  }

  this.getSprite = function() {
    return this.sprite;
  }

  this.getBullets = function() {
    return this.bullets;
  }

  this.getColor = function() {
    return this.color;
  }

  this.setColor = function(c) {
    this.color = c;
  }

  this.update = function() {
    this.sprite.position.set(this.getX(), this.getY());
    this.playerNameObject.position.set(this.getX() - this.playerNameObject.width / 2, this.getY() - 50);
    if (this.getID() != '') {
      this.getSprite().rotation = game.physics.arcade.angleToPointer(this.getSprite());
    }
  }

  this.setSprite = function(sprite) {
    this.sprite = sprite;
    this.playerNameObject = this.game.add.text(this.position.x * 32, this.position.y * 32 - 25, this.playerName, {font: '20px Impact', fill: '#fff', align: 'center'});
    this.sprite.body.checkCollision.left = true;
    this.sprite.body.checkCollision.right = true;
    this.sprite.body.checkCollision.down = true;
    this.sprite.body.checkCollision.up = true;
    this.sprite.body.setSize(60, 48);
  }
}

