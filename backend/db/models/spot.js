

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
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Street address is required" },
        notContains: { args: '  ', msg: "Street address is required" },
        len: { args: [2, 50], msg: "Length must be between 2 and 50 characters" }
      }
    },
    city: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "City is required" },
        notContains: { args: '  ', msg: "City is required" },
        len: { args: [2, 50], msg: "Length must be between 2 and 50 characters" }
      }
    },
    state: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "State is required" },
        notContains: { args: '  ', msg: "State is required" },
        len: { args: [2, 50], msg: "Length must be between 2 and 50 characters" }
      }
    },
    country: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Country is required" },
        notContains: { args: '  ', msg: "Country is required" },
        len: { args: [2, 50], msg: "Length must be between 2 and 50 characters" }
      }
    },
    lat: {
      type: DataTypes.FLOAT,
      validate: {
        max: { args: 90, msg: "Latitude is not valid" },
        min: { args: -90, msg: "Latitude is not valid" },
        notEmpty: true
      }
    },
    lng: {
      type: DataTypes.FLOAT,
      validate: {
        max: { args: 180, msg: "Longitude is not valid" },
        min: { args: -180, msg: "Longitude is not valid" },
        notEmpty: true
      }
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Name is required" },
        len: {
          args: [1, 50], msg: "Name must be less than 50 characters"
        },
        notContains: { args: '  ', msg: "Name is required" },
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Description is required" },
        notContains: { args: '  ', msg: "Description is required" },
        len: { args: [2, 50], msg: "Length must be between 2 and 50 characters" }

      }
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Price per day is required" },
        notNull: { msg: "Price per day is required" },
        isFloat: { msg: "Price is type float" },
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
