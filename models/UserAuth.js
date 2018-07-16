"use strict";

module.exports = (sequelize, DataTypes) => {
	let UserAuth = sequelize.define("UserAuth", {
		passwordHash :              DataTypes.STRING,
    salt:                       DataTypes.STRING,
		passwordResetCode:          DataTypes.STRING,
		passwordResetCodeExpiry:    DataTypes.DATE
	});
	UserAuth.associate = (models) => {
		UserAuth.belongsTo(models.User);
	};
	return UserAuth;
};