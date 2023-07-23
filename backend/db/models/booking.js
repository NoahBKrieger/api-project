
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
    startDate: DataTypes.TEXT,
    endDate: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
