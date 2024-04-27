/* eslint-disable camelcase */
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/mysql.js';
import Invoices from './invoices.js';
import Products_and_services from './products_and_services.js';

const Invoice_details = sequelize.define('invoice_details', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  description: {
    type: DataTypes.STRING,
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
  },
});

Invoice_details.belongsTo(Invoices, {
  foreignKey: { name: 'invoiceId', allowNull: false },
});
Invoice_details.belongsTo(Products_and_services, {
  foreignKey: { name: 'code', allowNull: false },
  targetKey: 'code',
});
Invoices.hasMany(Invoice_details, { foreignKey: { name: 'invoiceId' } });
Products_and_services.hasMany(Invoice_details, {
  foreignKey: { name: 'code' },
});
/* Invoice_details.sync({ alter: true }); */
export default Invoice_details;
