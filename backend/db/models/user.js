

'use strict';
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here

      User.hasMany(models.Booking, {
        foreignKey: 'userId', onDelete: 'CASCADE', hooks: true
      })

      User.hasMany(models.Review, {
        foreignKey: 'userId', onDelete: 'CASCADE', hooks: true
      })

      User.hasMany(models.Spot, {
        foreignKey: 'ownerId', onDelete: 'CASCADE', hooks: true
      })
    }
  };

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: { args: [1, 20], msg: "First Name is required" },
          notNull: { msg: 'First Name is required' },
          notEmpty: { msg: 'First Name is required' },
          validString(value) { if (typeof value != 'string') throw new Error('Invalid type') }

        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: { args: [1, 20], msg: "Length must be between 1 and 20 characters" },
          notNull: { msg: 'Last Name is required' },
          notEmpty: { msg: 'Last Name is required' },
          validString(value) { if (typeof value != 'string') throw new Error('Invalid type') }
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: { msg: 'User with that username already exists' },
        validate: {
          len: { args: [4, 30], msg: 'Please provide a username with at least 4 characters' },
          notNull: { msg: 'Username is required' },
          notEmpty: { msg: 'Username is required' },
          notContains: { args: ['@', '.'], msg: 'Username must not be an email' },
          validString(value) { if (typeof value != 'string') throw new Error('Invalid type') }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: { msg: 'User with that email already exists' },
        validate: {
          len: { args: [3, 256], msg: 'Invalid email' },
          isEmail: { msg: 'Invalid email' },
          notNull: { msg: 'Invalid email' }
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
      }
    }
  }
  );
  return User;
};
