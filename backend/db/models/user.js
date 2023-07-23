

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
          len: [1, 20],
          notNull: {
            msg: 'First Name is required'
          }
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 20],
          notNull: {
            msg: 'Last Name is required'
          }
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'User already exists with the specified username'
        },
        validate: {
          len: [4, 30],
          notNull: {
            msg: 'Username is required'
          },
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
        unique: {
          msg: 'User already exists with the specified email'
        },
        validate: {
          len: [3, 256],
          isEmail: true,
          notNull: {
            msg: 'Invalid email'
          }

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
