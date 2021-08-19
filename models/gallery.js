"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Gallery extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Gallery.init(
    {
      user_id: DataTypes.STRING,
      photos: DataTypes.ARRAY(DataTypes.JSONB),
    },
    {
      sequelize,
      modelName: "Gallery",
      tableName: "Gallery",
    }
  );
  return Gallery;
};
