

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

      validate: {
        notEmpty: { msg: "Street address is required" },
        notContains: '  ',
      }
    },
    city: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: { msg: "City is required" },
        notContains: '  ',
      }
    },
    state: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: { msg: "State is required" },
        notContains: '  ',
      }
    },
    country: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: { msg: "Country is required" },
        notContains: '  ',
      }
    },
    lat: {
      type: DataTypes.FLOAT,
      validate: {

        max: { args: 90, msg: "Latitude is not valid" },
        min: { args: -90, msg: "Latitude is not valid" }

      }
    },
    lng: {
      type: DataTypes.FLOAT,
      validate: {
        max: { args: 180, msg: "Longitude is not valid" },
        min: { args: -180, msg: "Longitude is not valid" }
      }
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Name is required" },
        len: {
          args: [1, 50],
          msg: "Name must be less than 50 characters"
        },
        notContains: '  ',
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Description is required" },
        notContains: '  ',

      }
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: { msg: "Price per day is required" }

      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
