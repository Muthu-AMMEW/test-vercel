import express from 'express';
import { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, createReview, getReviews, deleteReview, getAdminProducts, quickStart } from '../controllers/productController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middlewares/authenticate.js';
import { productUpload } from '../utils/gridfs/storeProuductImage.js';

const router = express.Router();

router.route('/quickstart').get(quickStart);
router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);
router.route('/review').put(isAuthenticatedUser, createReview);

//Admin routes
router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles('admin'), productUpload.array('images'), newProduct);
router.route('/admin/products').get(isAuthenticatedUser, authorizeRoles('admin'), getAdminProducts);
router.route('/admin/product/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);
router.route('/admin/product/:id').put(isAuthenticatedUser, authorizeRoles('admin'), productUpload.array('images'), updateProduct);
router.route('/admin/reviews').get(isAuthenticatedUser, authorizeRoles('admin'), getReviews);
router.route('/admin/review').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteReview);
export default router;
