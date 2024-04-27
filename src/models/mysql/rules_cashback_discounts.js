/* eslint-disable camelcase */
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/mysql.js';
import Users from './users.js';

const Rules_cashback_discounts = sequelize.define('rules_cashback_discounts', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
  },
  description: {
    type: DataTypes.STRING,
  },
  max_days_payment: {
    type: DataTypes.INTEGER,
  },

  min_amount: {
    type: DataTypes.DECIMAL(10, 2),
  },
  min_quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
});
Rules_cashback_discounts.belongsTo(Users, {
  foreignKey: { name: 'user_id', allowNull: false },
});
Users.hasMany(Rules_cashback_discounts, { foreignKey: { name: 'user_id' } });
/* Rules_cashback_discounts.sync({ alter: true }); */
export default Rules_cashback_discounts;
