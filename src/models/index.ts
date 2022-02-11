/* eslint-disable node/no-path-concat */
'use strict';

import { Sequelize } from 'sequelize';

import configs from '../config/index.json';
import useRole from './role';
import useUser from './user';
import useUserRoles from './user_roles';

const env = 'development';
const config = configs[env];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  ...config,
  dialect: 'postgres',
  timezone: 'America/Sao_Paulo',
  define: {
    freezeTableName: true,
    charset: 'utf8',
  },
});

const RoleModel = useRole(sequelize);
const UserModel = useUser(sequelize);
const UserRolesModel = useUserRoles(sequelize);

RoleModel.belongsToMany(UserModel, {
  through: 'users_roles',
  foreignKey: 'role_id',
  as: 'users',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

UserModel.belongsToMany(RoleModel, {
  through: 'users_roles',
  foreignKey: 'user_id',
  as: 'roles',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

export { Sequelize, sequelize };
export { RoleModel, UserModel, UserRolesModel };
