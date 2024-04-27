/* eslint-disable camelcase */
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/mysql.js';
import Clients from './clients.js';
import Users from './users.js';
import Users_business from './users_business.js';

const Invoices = sequelize.define('invoices', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'pending',
  },
  date: {
    type: DataTypes.DATEONLY,
    defaultValue: new Date().toISOString().slice(0, 10),
  },
});
Invoices.belongsTo(Users, {
  foreignKey: { name: 'parent_user_id', allowNull: false },
});
Invoices.belongsTo(Clients, {
  foreignKey: { name: 'client_id', allowNull: false },
});
Invoices.belongsTo(Users_business, {
  foreignKey: { name: 'business_id', allowNull: false },
});
Users.hasMany(Invoices, { foreignKey: { name: 'parent_user_id' } });
Clients.hasMany(Invoices, { foreignKey: { name: 'client_id' } });
Users_business.hasMany(Invoices, { foreignKey: { name: 'business_id' } });
/* Invoices.sync({ alter: true }); */
export default Invoices;
