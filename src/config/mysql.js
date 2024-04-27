import { Sequelize } from 'sequelize';
import credentials from './credentials.js';

const { user, password, database, host, port } = credentials;

const sequelize = new Sequelize(database, user, password, {
  host,
  dialect: 'mysql',
  port,
});

const dbConnectMySql = async () => {
  try {
    await sequelize.authenticate();
  } catch (e) {
    console.log('MYSQL Error Connection', e);
  }
};
const dbSync = async () => {
  const env = process.env.NODE_ENV || 'development';
  try {
    if (env === 'development') {
      await sequelize.sync();
    }

    console.log('All models were synchronized successfully.');
  } catch (e) {
    console.log('Error Synchronizing models', e);
  }
};

export { sequelize, dbConnectMySql, dbSync };
