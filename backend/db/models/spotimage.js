
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      SpotImage.belongsTo(models.Spot, {
        foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true
      })
    }
  }
  SpotImage.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    spotId: { type: DataTypes.INTEGER },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isUrl: { msg: 'Invalid URL' },
        validString(value) { if (typeof value != 'string') throw new Error('Invalid type') }

      }
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        validString(value) { if (typeof value != 'boolean') throw new Error('Invalid type') }

      }
    }
  }, {
    sequelize,
    modelName: 'SpotImage',
  });
  return SpotImage;
};
