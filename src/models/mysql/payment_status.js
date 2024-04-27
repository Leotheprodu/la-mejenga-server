/* eslint-disable camelcase */
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/mysql.js';

const Payment_status = sequelize.define(
  'payment_status',
  {
    id: {
      type: DataTypes.TINYINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: 'payment_status',
  },
);
/* Payment_status.sync({ alter: true }); */
export default Payment_status;
