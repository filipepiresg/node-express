/* eslint-disable node/no-path-concat */
'use strict';

import { Sequelize } from 'sequelize';

import configs from '../config/index.json';

const env = 'development';
const config = configs[env];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  ...config,
  dialect: 'postgres',
  define: {
    deletedAt: true,
  },
});

export { Sequelize, sequelize };