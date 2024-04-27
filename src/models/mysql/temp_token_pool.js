/* eslint-disable camelcase */
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/mysql.js';
import Users from './users.js';

const Temp_token_pool = sequelize.define(
  'temp_token_pool',
  {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.STRING(100),
      select: false,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: 'temp_token_pool',
  },
);
Temp_token_pool.belongsTo(Users, {
  foreignKey: { name: 'user_email', allowNull: false },
  targetKey: 'email',
});
Users.hasOne(Temp_token_pool, { foreignKey: { name: 'user_email' } });
/* Temp_token_pool.sync({ alter: true }); */
export default Temp_token_pool;
