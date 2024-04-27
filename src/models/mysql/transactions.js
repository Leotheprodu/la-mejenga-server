/* eslint-disable camelcase */
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/mysql.js';
import Users from './users.js';
import Payment_methods from './payment_methods.js';
import Payment_status from './payment_status.js';
import Clients from './clients.js';

const Transactions = sequelize.define('transactions', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  date: {
    type: DataTypes.DATEONLY,
    defaultValue: new Date().toISOString().slice(0, 10),
  },
});
Transactions.belongsTo(Users, {
  foreignKey: { name: 'parent_user_id', allowNull: false },
});
Transactions.belongsTo(Clients, {
  foreignKey: { name: 'client_id', allowNull: false },
});
Transactions.belongsTo(Payment_methods, {
  foreignKey: { name: 'payment_method_id', allowNull: false },
});
Transactions.belongsTo(Payment_status, {
  foreignKey: { name: 'status_id', allowNull: false },
});
Users.hasMany(Transactions, { foreignKey: { name: 'parent_user_id' } });
Clients.hasMany(Transactions, { foreignKey: { name: 'client_id' } });
Payment_methods.hasMany(Transactions, {
  foreignKey: { name: 'payment_method_id' },
});
Payment_status.hasMany(Transactions, {
  foreignKey: { name: 'status_id' },
});
/* Transactions.sync({ alter: true }); */

export default Transactions;
