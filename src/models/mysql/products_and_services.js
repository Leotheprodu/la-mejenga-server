/* eslint-disable camelcase */
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/mysql.js';
import Users from './users.js';
import Users_business from './users_business.js';

const Products_and_services = sequelize.define('products_and_services', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  unit: {
    type: DataTypes.STRING(50),
    defaultValue: 'unidad',
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  code: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING(50),
    defaultValue: 'service',
  },
  inventory_control: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});
Products_and_services.belongsTo(Users, {
  foreignKey: { name: 'user_id', allowNull: false },
});
Products_and_services.belongsTo(Users_business, {
  foreignKey: { name: 'business_id', allowNull: false },
});
Users.hasMany(Products_and_services, { foreignKey: { name: 'user_id' } });
Users_business.hasMany(Products_and_services, {
  foreignKey: { name: 'business_id' },
});
/* Products_and_services.sync({ alter: true }); */
export default Products_and_services;
