/* eslint-disable camelcase */
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/mysql.js';
import Users from './users.js';

const Activity_logs = sequelize.define('activity_logs', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
  },
  action: {
    type: DataTypes.STRING(50),
  },
  reference_id: {
    type: DataTypes.INTEGER,
  },
});
Activity_logs.belongsTo(Users, {
  foreignKey: { name: 'parent_user_id', allowNull: false },
});
Users.hasMany(Activity_logs, { foreignKey: { name: 'parent_user_id' } });

/* Activity_logs.sync({ alter: true }); */
export default Activity_logs;
