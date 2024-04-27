/* eslint-disable camelcase */
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/mysql.js';
import Transactions from './transactions.js';
import Invoices from './invoices.js';

const Transaction_invoices = sequelize.define('transaction_invoices', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});
Transactions.belongsToMany(Invoices, {
  through: Transaction_invoices,
});
Invoices.belongsToMany(Transactions, {
  through: Transaction_invoices,
});
/* Transaction_invoices.sync({ alter: true }); */
export default Transaction_invoices;
