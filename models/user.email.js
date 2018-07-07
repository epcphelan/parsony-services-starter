"use strict";

module.exports = (sequelize, DataTypes) => {
    let UserEmail = sequelize.define("UserEmail", {
        email:                          {type: DataTypes.STRING},
        emailConfirmed :                {type: DataTypes.BOOLEAN, defaultValue: false},
        emailConfirmationCode:          {type: DataTypes.STRING},
        emailConfirmationCodeExpiry:    DataTypes.DATE
    });
    UserEmail.associate = (models) => {
			UserEmail.belongsTo(models.User);
		};
    return UserEmail;
};