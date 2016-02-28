var GameObject = function(position, sprite, passable, size, imovable, physics) {
  this.position = position;
  this.sprite = sprite;

  if (physics) {
    this.sprite.body.setSize(size.w, size.h);
    this.sprite.body.imovable = imovable;

    this.sprite.body.checkCollision.left = passable;
    this.sprite.body.checkCollision.right = passable;
    this.sprite.body.checkCollision.down = passable;
    this.sprite.body.checkCollision.up = passable;
  }

  this.update = function() {
    this.sprite.position.set(this.position.x, this.position.y);
  };
}
