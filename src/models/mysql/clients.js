import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/mysql.js';
import Users from './users.js';

const Clients = sequelize.define(
  'clients',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
    },
    email: {
      type: DataTypes.STRING(50),
      defaultValue: '',
    },
    cellphone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    token: {
      type: DataTypes.STRING(50),
      unique: true,
    },
    pin: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    country: {
      type: DataTypes.STRING(50),
    },
    address: {
      type: DataTypes.STRING(50),
      defaultValue: '',
    },
    detail: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    defaultScope: {
      attributes: { exclude: ['pin'] },
    },
  },
);
Clients.addScope('withPin', {
  attributes: { include: ['pin'] },
});
Clients.belongsTo(Users, {
  foreignKey: { name: 'user_id', allowNull: true },
});
Clients.belongsTo(Users, {
  foreignKey: { name: 'parent_user_id', allowNull: false },
});
Users.hasMany(Clients, { foreignKey: { name: 'user_id' } });
Users.hasOne(Clients, { foreignKey: { name: 'parent_user_id' } });
/* Clients.sync({ alter: true }); */
export default Clients;
