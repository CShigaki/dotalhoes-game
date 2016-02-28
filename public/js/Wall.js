var DEFAULT_WALL_SIZE = {"w": 60, "h": 48}

var Wall = function(position, sprite) {
  // Call parent class constructor
  GameObject.call(this, position, sprite, true, DEFAULT_WALL_SIZE, false, true);
}

// Wall inherit from GameObject
Wall.prototype = Object.create(GameObject.prototype);
