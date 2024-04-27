/* eslint-disable camelcase */
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/mysql.js';
import Users from './users.js';
import Roles from './roles.js';

const Role_users = sequelize.define('role_users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});
Role_users.belongsTo(Users, {
  foreignKey: { name: 'user_id', allowNull: false },
});
Role_users.belongsTo(Roles, {
  foreignKey: { name: 'role_id', allowNull: false },
});
Users.hasMany(Role_users, { foreignKey: { name: 'user_id' } });
Roles.hasMany(Role_users, { foreignKey: { name: 'role_id' } });
/* Role_users.sync({ alter: true }); */
export default Role_users;
