/* eslint-disable camelcase */
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/mysql.js';
import Clients from './clients.js';
import Users_business from './users_business.js';

const Balances = sequelize.define('balances', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});
Balances.belongsTo(Clients, {
  foreignKey: { name: 'client_id', allowNull: false },
});
Balances.belongsTo(Users_business, {
  foreignKey: { name: 'business_id', allowNull: false },
});
Clients.hasMany(Balances, { foreignKey: { name: 'client_id' } });
Users_business.hasMany(Balances, { foreignKey: { name: 'business_id' } });
/* Balances.sync({ alter: true }); */
export default Balances;
