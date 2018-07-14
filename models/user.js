"use strict";

module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define(
    "User",
    {
      username: { type: DataTypes.STRING, unique: true }
    },
    {
      paranoid: true
    }
  );
  User.associate = models => {
    User.hasOne(models.UserAuth, { onDelete: "cascade" });
    User.hasMany(models.UserSessions, { onDelete: "cascade" });
  };
  return User;
};
