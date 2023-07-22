'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId', onDelete: 'CASCADE', hooks: true
      })

      Spot.hasMany(models.Review, {
        foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true
      })

      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true
      })
    }
  }
  Spot.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ownerId: DataTypes.INTEGER,
    address: DataTypes.TEXT,
    city: DataTypes.TEXT,
    state: DataTypes.TEXT,
    country: DataTypes.TEXT,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    name: DataTypes.TEXT,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
