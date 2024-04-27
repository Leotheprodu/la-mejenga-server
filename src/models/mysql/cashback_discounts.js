/* eslint-disable camelcase */
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/mysql.js';
import Business from './users_business.js';
import Rules_cashback_discounts from './rules_cashback_discounts.js';

const Cashback_discounts = sequelize.define('cashback_discounts', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  description: {
    type: DataTypes.STRING,
  },
  message: {
    type: DataTypes.STRING,
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
  },
  is_percentage: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: 'discount',
    description: 'discount or cashback',
  },
});
Cashback_discounts.belongsTo(Business, {
  foreignKey: { name: 'business_id', allowNull: false },
});
Cashback_discounts.belongsTo(Rules_cashback_discounts, {
  foreignKey: { name: 'rule_id', allowNull: true },
});
Business.hasMany(Cashback_discounts, { foreignKey: { name: 'business_id' } });
Rules_cashback_discounts.hasMany(Cashback_discounts, {
  foreignKey: { name: 'rule_id' },
});
/* Cashback_discounts.sync({ alter: true }); */

export default Cashback_discounts;
