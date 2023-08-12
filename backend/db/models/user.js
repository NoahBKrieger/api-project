

'use strict';
const { Model, Validator } = require('sequelize');

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
          len: { args: [1, 20], msg: "Length must be between 1 and 20 characters" },
          notNull: { msg: 'First Name is required' },
          notEmpty: { msg: 'First Name is required' },
          isAlpha: { msg: 'Can only contain letters' },
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: { args: [1, 20], msg: "Length must be between 1 and 20 characters" },
          notNull: { msg: 'Last Name is required' },
          notEmpty: { msg: 'Last Name is required' },
          isAlpha: { msg: 'Can only contain letters' },
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'User already exists with the specified username' },
        validate: {
          len: { args: [4, 30], msg: "Length must be between 4 and 30 characters" },
          notNull: { msg: 'Username is required' },
          isAlphanumeric: true,
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'User already exists with the specified email' },
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
