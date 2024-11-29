const Clients = require("./clients");
const Rooms = require("./rooms");
const Reservations = require("./reservations");
const Owner = require("./owner");
const Users = require("./users");

const defineAssociations = () => {
  // Relation entre Clients et Reservations
  Clients.hasMany(Reservations, { foreignKey: "id_clients", as: "reservations" });
  Reservations.belongsTo(Clients, { foreignKey: "id_clients", as: "client" });

  // Relation entre Rooms et Reservations
  Rooms.hasMany(Reservations, { foreignKey: "id_rooms", as: "reservations" });
  Reservations.belongsTo(Rooms, { foreignKey: "id_rooms", as: "room" });

  // Relation entre Owner et Rooms
  Owner.hasMany(Rooms, { foreignKey: "id_owner", as: "rooms" });
  Rooms.belongsTo(Owner, { foreignKey: "id_owner", as: "owner" });

  // Relation entre Users et Owner
  Users.hasOne(Owner, { foreignKey: "user_id", as: "owner" });
  Owner.belongsTo(Users, { foreignKey: "user_id", as: "user" });

  // Relation entre Users et Clients
  Users.hasOne(Clients, { foreignKey: "user_id", as: "client" });
  Clients.belongsTo(Users, { foreignKey: "user_id", as: "user" });
};

module.exports = defineAssociations;
