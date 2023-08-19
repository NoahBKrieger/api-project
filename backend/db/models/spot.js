

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
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Street address is required" },
        notContains: { args: '  ', msg: "Street address is required" },
        len: { args: [2, 50], msg: "Length must be between 2 and 50 characters" },
        validString(value) { if (typeof value != 'string') throw new Error('Invalid type') }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "City is required" },
        notContains: { args: '  ', msg: "City is required" },
        len: { args: [2, 50], msg: "Length must be between 2 and 50 characters" },
        validString(value) { if (typeof value != 'string') throw new Error('Invalid type') }

      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "State is required" },
        notContains: { args: '  ', msg: "State is required" },
        len: { args: [2, 50], msg: "Length must be between 2 and 50 characters" },
        validString(value) { if (typeof value != 'string') throw new Error('Invalid type') }

      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Country is required" },
        notContains: { args: '  ', msg: "Country is required" },
        len: { args: [2, 50], msg: "Length must be between 2 and 50 characters" },
        validString(value) { if (typeof value != 'string') throw new Error('Invalid type') }

      }
    },
    lat: {
      type: DataTypes.FLOAT,
      validate: {
        max: { args: 90, msg: "Latitude is not valid" },
        min: { args: -90, msg: "Latitude is not valid" },
        validString(value) { if (typeof value != 'number') throw new Error('Invalid type') }

      }
    },
    lng: {
      type: DataTypes.FLOAT,
      validate: {
        max: { args: 180, msg: "Longitude is not valid" },
        min: { args: -180, msg: "Longitude is not valid" },
        validString(value) { if (typeof value != 'number') throw new Error('Invalid type') }

      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Name is required" },
        len: { args: [1, 50], msg: "Name must be less than 50 characters" },
        notContains: { args: '  ', msg: "Name is required" },
        validString(value) { if (typeof value != 'string') throw new Error('Invalid type') }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Description is required" },
        notContains: { args: '  ', msg: "Description is required" },
        len: { args: [2, 50], msg: "Length must be between 2 and 50 characters" },
        validString(value) { if (typeof value != 'string') throw new Error('Invalid type') }


      }
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Price per day is required" },
        notNull: { msg: "Price per day is required" },
        isFloat: { msg: "Price is type float" },
        validString(value) { if (typeof value != 'number') throw new Error('Invalid type') }

      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
