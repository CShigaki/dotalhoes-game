var DEFAULT_FLOOR_SIZE = {"w": 60, "h": 48}

var Floor = function(position, sprite) {
  // Call parent class constructor
  GameObject.call(this, position, sprite, true, DEFAULT_FLOOR_SIZE, true, false);
}

// Floor inherit from GameObject
Floor.prototype = Object.create(GameObject.prototype);
