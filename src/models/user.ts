'use strict';
import { genSaltSync as genSalt, hashSync as hash } from 'bcryptjs';
import {
  Association,
  DataTypes,
  BelongsToManyAddAssociationMixin,
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

import { Role } from './role';

export class User extends Model<
  InferAttributes<User, { omit: 'roles' }>,
  InferCreationAttributes<User, { omit: 'roles' }>
> {
  declare id: CreationOptional<number>;
  declare firstName: string;
  declare lastName: CreationOptional<string>;
  declare email: string;
  declare password: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date | null>;

  declare getRoles: BelongsToManyGetAssociationsMixin<Role>; // Note the null assertions!
  declare addRole: BelongsToManyAddAssociationMixin<Role, number>;
  declare addRoles: BelongsToManyAddAssociationsMixin<Role, number>;
  declare setRoles: BelongsToManySetAssociationsMixin<Role, number>;
  declare removeRole: BelongsToManyRemoveAssociationMixin<Role, number>;
  declare removeRoles: BelongsToManyRemoveAssociationsMixin<Role, number>;
  declare hasRole: BelongsToManyHasAssociationMixin<Role, number>;
  declare hasRoles: BelongsToManyHasAssociationsMixin<Role, number>;
  // declare countRoles: BelongsToManyCountAssociationsMixin;
  // declare createRole: BelongsToManyCreateAssociationMixin<Role, 'id'>;

  declare roles?: NonAttribute<Role[]>;

  declare static associations: {
    roles: Association<User, Role>;
  };
}

export default (sequelize: Sequelize) => {
  return User.init(
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
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'users',
      timestamps: true,
      paranoid: true,
      deletedAt: true,
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
      scopes: {
        users: {
          include: [
            {
              model: Role,
              as: 'roles',
              where: {
                name: 'user',
              },
            },
          ],
        },
        moderators: {
          include: [
            {
              model: Role,
              as: 'roles',
              where: {
                name: 'moderator',
              },
            },
          ],
        },
        admins: {
          include: [
            {
              model: Role,
              as: 'roles',
              where: {
                name: 'admin',
              },
            },
          ],
        },
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
    }
  );
};
