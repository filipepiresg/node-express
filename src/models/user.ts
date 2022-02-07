'use strict';
import { genSaltSync as genSalt, hashSync as hash } from 'bcryptjs';
import { DataTypes, ModelDefined } from 'sequelize';

import { UserAttributes, UserCreationAttributes } from '../@types/user';
import { sequelize } from './index';

const User: ModelDefined<UserAttributes, UserCreationAttributes> = sequelize.define(
  'users',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 20],
          msg: 'The password field must be between 6 and 20 characters',
        },
      },
    },
  },
  {
    hooks: {
      beforeCreate: (user) => {
        const password = user.getDataValue('password');

        if (password) {
          const salt = genSalt(8);
          const password_hash = hash(password, salt);
          user.set('password', password_hash);
        }
      },
      beforeSave: (user) => {
        const email = user.getDataValue('email');
        if (email) {
          user.set('email', email.toLowerCase());
        }
      },
      beforeBulkCreate: (users) => {
        users.forEach((user) => {
          const password = user.getDataValue('password');
          if (password) {
            const salt = genSalt(8);
            const password_hash = hash(password, salt);
            user.set('password', password_hash);
          }
        });
      },
    },
    defaultScope: {
      attributes: ['id', 'email', 'firstName', 'lastName', 'createdAt', 'updatedAt'],
      order: ['id'],
    },
    getterMethods: {
      password: () => undefined,
    },
    indexes: [
      {
        fields: ['email'],
        unique: true,
      },
    ],
    modelName: 'users',
    timestamps: true,
    paranoid: true,
  }
);

export default User;
