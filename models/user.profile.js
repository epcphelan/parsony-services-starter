"use strict";

module.exports = (sequelize, DataTypes) => {
  let UserProfile = sequelize.define("UserProfile", {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    profileImage: DataTypes.STRING
  });
  UserProfile.associate = models => {
    UserProfile.belongsTo(models.User);
  };
  return UserProfile;
};
