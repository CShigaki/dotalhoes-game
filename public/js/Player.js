var DEFAULT_PLAYER_HP = 200;
var DEFAULT_PLAYER_SIZE = {"w": 60, "h": 48}
var DEFAULT_PLAYER_WEAPONS = [];

var Player = function(id, name, color, position, rotation, sprite, game) {
  // Call parent class constructor
  GameObject.call(this, position, sprite, false, DEFAULT_PLAYER_SIZE, false, true);
  this.hp = DEFAULT_PLAYER_HP;
  this.name = name;
  this.id = id;
  this.sprite = sprite;
  this.game = game;
  this.color = color;
  this.weapons = DEFAULT_PLAYER_WEAPONS;
  this.equipped_weapon = 0;

  this.changeWeapon = function(index) {
    this.equipped_weapon = index;
    // TODO(heylouiz): Redraw player with new weapon
  };

  this.reloadWeapon = function() {
    this.weapons[this.equipped_weapon].reload();
  };

  this.getAmmo = function() {
    return this.weapons[this.equipped_weapon].getAmmo();
  };

  this.shot = function() {
    this.weapons[this.equipped_weapon].shot();
  };

  this.getInventory = function() {
    return this.weapons;
  };

  this.serverInfo = function() {
    return {"id": this.id,
            "name": this.name,
            "position": {"x": this.position.x, "y": this.position.y},
            "color": this.color,
            "hp": this.hp}
  }
};

// Player inherit from GameObject
Player.prototype = Object.create(GameObject.prototype);
