"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      full_Name: DataTypes.STRING,
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      profile_Bio: DataTypes.STRING,
      followers: DataTypes.INTEGER,
      following: DataTypes.INTEGER,
      session_id: DataTypes.STRING,
      timestamp: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "User",
    }
  );
  return User;
};
