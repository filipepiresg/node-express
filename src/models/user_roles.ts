'use strict';
import { DataTypes, ModelDefined, Sequelize } from 'sequelize';

import { UserRoleAttributes, UserRoleCreationAttributes, UserRoleInstance } from '../@types/role';

export default (sequelize: Sequelize) => {
  const UserRole: ModelDefined<UserRoleAttributes, UserRoleCreationAttributes> =
    sequelize.define<UserRoleInstance>(
      'users_roles',
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        role_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'roles',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      },
      {
        modelName: 'users_roles',
        tableName: 'users_roles',
        createdAt: false,
        updatedAt: false,
        deletedAt: false,
        timestamps: false,
      }
    );

  return UserRole;
};
