const Clients = require("./clients");
const Rooms = require("./rooms");
const Reservations = require("./reservations");
const Owner = require("./owner");

const defineAssociations = () => {
  Clients.hasMany(Reservations, { foreignKey: "id_clients", as: "reservations" });
  Reservations.belongsTo(Clients, { foreignKey: "id_clients", as: "client" });

  Rooms.hasMany(Reservations, { foreignKey: "id_rooms", as: "reservations" });
  Reservations.belongsTo(Rooms, { foreignKey: "id_rooms", as: "room" });

  Owner.hasMany(Rooms, { foreignKey: "id_owner", as: "rooms" });
  Rooms.belongsTo(Owner, { foreignKey: "id_owner", as: "owner" });
};

module.exports = defineAssociations;
