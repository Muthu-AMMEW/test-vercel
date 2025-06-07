import express from 'express';
import { newOrder, getSingleOrder, myOrders, orders, updateOrder, deleteOrder, cancelOrder } from '../controllers/orderController.js';

import { isAuthenticatedUser, authorizeRoles } from '../middlewares/authenticate.js';

const router = express.Router();

router.route('/order/new').post(isAuthenticatedUser, newOrder);
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);
router.route('/myorders').get(isAuthenticatedUser, myOrders);
router.route('/order/:id').put(isAuthenticatedUser, cancelOrder);

//Admin Routes
router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles('admin'), orders);
router.route('/admin/order/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateOrder)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder);

export default router;
