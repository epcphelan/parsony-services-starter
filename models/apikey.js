"use strict";

module.exports = (sequelize, DataTypes) => {
    const ApiKey = sequelize.define("ApiKey", {
        key:  DataTypes.STRING,
        enabled: {type: DataTypes.BOOLEAN, defaultValue:true},
        secret: DataTypes.STRING
    });
    return ApiKey;
};