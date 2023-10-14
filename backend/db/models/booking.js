
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Booking.belongsTo(models.User, {
        foreignKey: 'userId', onDelete: 'CASCADE', hooks: true
      })

      Booking.belongsTo(models.Spot, {
        foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true
      })
    }
  }
  Booking.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    spotId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    startDate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isDate: { msg: 'StartDate is required in valid date format: YYYY-MM-DD' },
        validString(value) { if (typeof value != 'string') throw new Error('StartDate is required in valid date format: YYYY-MM-DD') }
      }
    },
    endDate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isDate: { msg: 'EndDate is required in valid date format: YYYY-MM-DD' },
        validString(value) { if (typeof value != 'string') throw new Error('EndDate is required in valid date format: YYYY-MM-DD') }
      }
    },
  }, {
    sequelize,
    validate: {},
    modelName: 'Booking',
  });
  return Booking;
};
