import { BusinessConfigInfo } from '../config/constants.js';
import models from '../models/index.js';
import { refreshUserRoles } from './handleRoles.js';
import userBusinessChecker from './userBusinessChecker.js';

const RefreshSessionData = async (req) => {
  const { id } = req.session.user;
  const client =
    (await models.clientsModel.findAll({
      where: { user_id: id },
      include: [
        {
          model: models.balancesModel,
          attributes: ['id', 'amount'],
          include: [
            {
              model: models.users_businessModel,
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
      attributes: ['id', 'parent_user_id', 'active'],
    })) || null;
  if (req.session.employee.isEmployee) {
    const employee = await models.employeesModel.findOne({
      where: { username: req.session.employee.employeeName },
    });
    req.session.employee = {
      isEmployee: true,
      isAdmin: employee.admin,
      active: employee.active,
      employeeName: employee.username,
    };
  } else {
    req.session.employee = {
      isEmployee: false,
      isAdmin: true,
      active: false,
      employeeName: '',
    };
  }
  const appClient = client.find(
    (thisClient) => thisClient.parent_user_id === BusinessConfigInfo.userId,
  );
  req.session.roles = await refreshUserRoles(id);
  const balance = req.session.roles.includes(1)
    ? 1000000
    : appClient.balances[0].amount;
  req.session.client = client;
  req.session.balance = balance * 1;
  await userBusinessChecker(req, id);
};

export default RefreshSessionData;
