import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/mysql.js';
import Users from './users.js';

const Employees = sequelize.define(
  'employees',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      select: false,
      allowNull: false,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
  },
);

Employees.addScope('withPassword', {
  attributes: { include: ['password'] },
});
Employees.belongsTo(Users, {
  foreignKey: { name: 'parent_user_id', allowNull: false },
});
Users.hasMany(Employees, { foreignKey: { name: 'parent_user_id' } });
/* Employees.sync({ alter: true }); */
export default Employees;
