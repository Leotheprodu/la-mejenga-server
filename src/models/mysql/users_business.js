/* eslint-disable camelcase */
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/mysql.js';
import Users from './users.js';

const Users_business = sequelize.define(
  'users_business',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'users_business',
  },
);
Users_business.belongsTo(Users, {
  foreignKey: { name: 'user_id', allowNull: false },
});
Users.hasMany(Users_business, { foreignKey: { name: 'user_id' } });
/* Users_business.sync({ alter: true }); */
export default Users_business;
