import express from 'express';
import { isLoggedInTrue } from '../middleware/isLoggedIn.js';
import {
  createInvoiceCtrl,
  getInvoicesByClientCtrl,
  addTransactionCtrl,
  deleteInvoicesByClientCtrl,
  getInvoicesByTokenCtrl,
  getTransactionsDashboardCtrl,
  getDetailsDashboardCtrl,
} from '../controllers/invoices.controller.js';
import {
  validatorCreateInvoice,
  validateInvoiceClientId,
  validatorAddTransaction,
} from '../validators/invoices.js';
import checkClientOfUser from '../middleware/checkClientOfUser.js';
import checkIfBalanceCoverInvoice from '../middleware/checkIfBalanceCoverInvoice.js';
import { checkPin } from '../middleware/checkPin.js';
import {
  validatorDashboardClient,
  validatorDashboardTransactions,
} from '../validators/clients.js';

const router = express.Router();
router.get(
  '/:id',
  isLoggedInTrue,
  validateInvoiceClientId,
  checkClientOfUser,
  getInvoicesByClientCtrl,
);
router.delete(
  '/delete/:id',
  isLoggedInTrue,
  validateInvoiceClientId,
  deleteInvoicesByClientCtrl,
);
router.post(
  '/create/:id',
  isLoggedInTrue,
  validatorCreateInvoice,
  checkClientOfUser,
  checkIfBalanceCoverInvoice,
  createInvoiceCtrl,
);
router.post(
  '/add-transaction/:id',
  isLoggedInTrue,
  validatorAddTransaction,
  checkClientOfUser,
  addTransactionCtrl,
);
router.post(
  '/dashboard-info/:token',
  checkPin,
  validatorDashboardClient,
  getInvoicesByTokenCtrl,
);
router.post(
  '/dashboard-transactions/:token',
  checkPin,
  validatorDashboardTransactions,
  getTransactionsDashboardCtrl,
);
router.post(
  '/dashboard-invoice-details/:token',
  checkPin,
  validatorDashboardTransactions,
  getDetailsDashboardCtrl,
);

export default router;
