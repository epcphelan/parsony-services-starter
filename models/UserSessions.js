"use strict";

module.exports = (sequelize, DataTypes) => {
	let UserSessions = sequelize.define("UserSessions", {
		sessionToken: DataTypes.STRING,
		sessionStart: DataTypes.DATE,
    options: DataTypes.JSON
	});
	UserSessions.associate = (models) => {
		UserSessions.belongsTo(models.User)
	};
	return UserSessions;
};