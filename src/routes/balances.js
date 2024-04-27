import express from 'express';
import {
  balanceByClientCtrl,
  ClientBalancesCtrl,
  getBalancesTypesCtrl,
  getBalanceTypeCtrl,
  rechargeBalancesCtrl,
  balancesRechargesCtrl,
  applyBalanceRechargeCtrl,
  cancelBalanceRechargeCtrl,
} from '../controllers/balances.controller.js';
import { isLoggedInTrue } from '../middleware/isLoggedIn.js';
import {
  validatorGetBalanceByClient,
  validatorRechargeBalance,
} from '../validators/balances.js';
import checkClientOfUser from '../middleware/checkClientOfUser.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

router.get(
  '/:id',
  isLoggedInTrue,
  validatorGetBalanceByClient,
  checkClientOfUser,
  balanceByClientCtrl,
);
router.get('/', isLoggedInTrue, ClientBalancesCtrl);
router.get('/types/balance', getBalancesTypesCtrl);
router.get(
  '/types/balance/:id',
  validatorGetBalanceByClient,
  getBalanceTypeCtrl,
);
router.get(
  '/recharges/:id',
  isLoggedInTrue,
  validatorGetBalanceByClient,
  balancesRechargesCtrl,
);
router.patch(
  '/recharges/ok/:id',
  isLoggedInTrue,
  isAdmin,
  validatorGetBalanceByClient,
  applyBalanceRechargeCtrl,
);
router.patch(
  '/recharges/cancel/:id',
  isLoggedInTrue,
  isAdmin,
  validatorGetBalanceByClient,
  cancelBalanceRechargeCtrl,
);
router.post(
  '/recharge',
  isLoggedInTrue,
  validatorRechargeBalance,
  rechargeBalancesCtrl,
);

export default router;
