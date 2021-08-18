'use strict';
const {
  Model
} = require('sequelize');
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
  };
  User.init({
    Full_Name: DataTypes.STRING,
    Username: DataTypes.STRING,
    Email: DataTypes.STRING,
    Password: DataTypes.STRING,
    Profile_Bio: DataTypes.STRING,
    Followers: DataTypes.INTEGER,
    Following: DataTypes.INTEGER,
    Session_id: DataTypes.STRING,
		Timestamp: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};