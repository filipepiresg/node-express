'use strict';

import {
  Association,
  DataTypes,
  BelongsToManyAddAssociationMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyHasAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyRemoveAssociationsMixin,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  Sequelize,
} from 'sequelize';

import { User } from './user';

export class Role extends Model<
  InferAttributes<Role, { omit: 'users' }>,
  InferCreationAttributes<Role, { omit: 'users' }>
> {
  declare id: CreationOptional<number>;
  declare name: string;

  declare getUsers: BelongsToManyGetAssociationsMixin<User>; // Note the null assertions!
  declare addUser: BelongsToManyAddAssociationMixin<User, number>;
  declare addUsers: BelongsToManyAddAssociationsMixin<User, number>;
  declare setUsers: BelongsToManySetAssociationsMixin<User, number>;
  declare removeUser: BelongsToManyRemoveAssociationMixin<User, number>;
  declare removeUsers: BelongsToManyRemoveAssociationsMixin<User, number>;
  declare hasUser: BelongsToManyHasAssociationMixin<User, number>;
  declare hasUsers: BelongsToManyHasAssociationsMixin<User, number>;
  declare countUsers: BelongsToManyCountAssociationsMixin;
  // declare createUser: BelongsToManyCreateAssociationMixin<User, 'id'>;

  declare users?: NonAttribute<User[]>;

  declare static associations: {
    users: Association<Role, User>;
  };
}
export default (sequelize: Sequelize) => {
  return Role.init(
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
      sequelize,
      modelName: 'roles',
      timestamps: false,
      paranoid: false,
    }
  );
};
