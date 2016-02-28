var Player = function(id, name, room, position, rotation, color, socket) {
  this.id = id; // TODO: Generate player ID
  this.name = name;
  this.room = room;
  this.position = position;
  this.rotation = rotation;
  this.color = color; // TODO: Generate player color
  this.socket = socket;

  this.serverInfo = function() {
    return {"id": this.id,
            "name": this.name,
            "room": this.room,
            "position": this.position,
            "rotation": this.rotation,
            "color": this.color}
  }
};

exports.Player = Player;
