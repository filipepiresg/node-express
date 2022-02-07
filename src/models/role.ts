'use strict';

import { DataTypes, ModelDefined } from 'sequelize';

import { RoleAttributes, RoleCreationAttributes } from '../@types/role';
import { sequelize } from './index';

const Role: ModelDefined<RoleAttributes, RoleCreationAttributes> = sequelize.define(
  'roles',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isLowercase: true,
      },
    },
  },
  {
    modelName: 'roles',
    timestamps: false,
    paranoid: false,
  }
);

export default Role;
