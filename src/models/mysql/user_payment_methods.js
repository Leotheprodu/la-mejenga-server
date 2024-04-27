/* eslint-disable camelcase */
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/mysql.js';
import Users_business from './users_business.js';
import Payment_methods from './payment_methods.js';

const User_payment_methods = sequelize.define('user_payment_methods', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  payment_method_full_name: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  payment_method_cellphone: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  payment_method_iban: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  payment_method_email: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  payment_method_description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
User_payment_methods.belongsTo(Payment_methods, {
  foreignKey: { name: 'payment_method_id', allowNull: false },
});
User_payment_methods.belongsTo(Users_business, {
  foreignKey: { name: 'business_id', allowNull: false },
});
Payment_methods.hasMany(User_payment_methods, {
  foreignKey: { name: 'payment_method_id' },
});
Users_business.hasMany(User_payment_methods, {
  foreignKey: { name: 'business_id' },
});
/* User_payment_methods.sync({ alter: true }); */
export default User_payment_methods;
