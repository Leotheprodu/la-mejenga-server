import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/mysql.js';

const Roles = sequelize.define('roles', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  rol_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
});
/* Roles.sync({ alter: true }); */
export default Roles;
