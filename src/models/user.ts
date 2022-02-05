'use strict';
import { genSalt, hash } from 'bcryptjs';
import { DataTypes, ModelDefined } from 'sequelize';

import { UserAttributes, UserCreationAttributes } from '../@types/user';
import { sequelize } from './index';

const User: ModelDefined<UserAttributes, UserCreationAttributes> = sequelize.define(
  'user',
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
      get: () => undefined,
    },
  },
  {
    hooks: {
      beforeSave: async (user) => {
        const password = user.getDataValue('password');
        if (password) {
          const salt = await genSalt(8);
          const password_hash = await hash(password, salt);
          user.set('password', password_hash);
        }
      },
    },
    tableName: 'USERS',
  }
);

export default User;
