var Floor = function(xCoord, yCoord, sprite, passable) {
  this.x = xCoord;              // X Coordinates
  this.y = yCoord;              // Y Coordinates
  this.passable = passable;     // If the floor is passable
  this.sprite = sprite;         // The tile sprite
  this.itemList = new Array();  // The item list

  this.getX = function() {
    return this.x;
  }

  this.getY = function() {
    return this.y;
  }

  this.setX = function(x) {
    this.x = x;
  }

  this.setY = function(y) {
    this.y = y;
  }

  this.isPassable = function() {
    return this.passable;
  }

  this.getSprite = function() {
    return this.sprite;
  }
}

