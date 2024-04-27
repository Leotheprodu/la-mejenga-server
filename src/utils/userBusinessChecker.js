/* eslint-disable camelcase */
import models from '../models/index.js';

const userBusinessChecker = async (req, user_id) => {
  const business = await models.users_businessModel.findAll({
    where: { user_id },
  });
  req.session.userBusiness = business.map((item) => item.id);
  return business;
};
export default userBusinessChecker;
