/* eslint-disable camelcase */
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/mysql.js';
import Clients from './clients.js';
import Balances from './balances.js';
import Invoices from './invoices.js';

const Balances_updates = sequelize.define('balances_updates', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
  },
});
Balances_updates.belongsTo(Clients, {
  foreignKey: { name: 'client_id', allowNull: false },
});
Balances_updates.belongsTo(Balances, {
  foreignKey: { name: 'balance_id', allowNull: false },
});
Balances_updates.belongsTo(Invoices);
Clients.hasMany(Balances_updates, { foreignKey: { name: 'client_id' } });
Balances.hasMany(Balances_updates, { foreignKey: { name: 'balance_id' } });
Invoices.hasMany(Balances_updates);
/* Balances_updates.sync({ alter: true }); */
export default Balances_updates;
