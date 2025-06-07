// import catchAsyncError from '../middlewares/catchAsyncError.js';
// import Order from '../models/orderModel.js';
// import Product from '../models/productModel.js';
// import ErrorHandler from '../utils/errorHandler.js';

// //Updating the product stock of each order item
// async function subStock(productId, quantity) {
//     const product = await Product.findById(productId);
//     product.stock = product.stock - quantity;
//     product.save({ validateBeforeSave: false })
// }
// async function addStock(productId, quantity) {
//     const product = await Product.findById(productId);
//     product.stock = product.stock + quantity;
//     product.save({ validateBeforeSave: false })
// }

// //Create New Order - api/v1/order/new
// export const newOrder = catchAsyncError(async (req, res, next) => {
//     const {
//         orderItems,
//         shippingInfo,
//         itemsPrice,
//         taxPrice,
//         shippingPrice,
//         totalPrice,
//         paymentInfo
//     } = req.body;

//     orderItems.map(product => product.image.length > 0 ? product.image = new URL(product.image).pathname + new URL(product.image).search + new URL(product.image).hash : undefined);

//     const order = await Order.create({
//         orderItems,
//         shippingInfo,
//         itemsPrice,
//         taxPrice,
//         shippingPrice,
//         totalPrice,
//         paymentInfo,
//         paidAt: Date.now(),
//         user: req.user.id
//     })

//     //Updating the product stock of each order item
//     order.orderItems.forEach(async orderItem => {
//         await subStock(orderItem._id, orderItem.quantity)
//     })

//     order.orderItems.map(product => product.image.length > 0 ? product.image = `${process.env.SERVER_URL + product.image}` : undefined);

//     res.status(200).json({
//         success: true,
//         order
//     })
// })

// //Get Single Order - api/v1/order/:id
// export const getSingleOrder = catchAsyncError(async (req, res, next) => {
//     const order = await Order.findById(req.params.id).populate('user', 'fullName email');
//     if (!order) {
//         return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404))
//     }

//     order.orderItems.map(product => product.image.length > 0 ? product.image = `${process.env.SERVER_URL + product.image}` : undefined);

//     res.status(200).json({
//         success: true,
//         order
//     })
// })

// //Cancel Order / Order Status - api/v1/order/:id
// export const cancelOrder = catchAsyncError(async (req, res, next) => {
//     const order = await Order.findById(req.params.id);

//     if (order.orderStatus == 'Shipped' && req.body.orderStatus == 'Processing') {
//         return next(new ErrorHandler('Order has been already shipped!', 400))
//     }

//     if (order.orderStatus == 'Delivered') {
//         return next(new ErrorHandler('Order has been already delivered!', 400))
//     }

//     if (order.orderStatus == 'Cancelled') {
//         return next(new ErrorHandler('Order has been already Cancelled!', 400))
//     }

//     if (req.body.orderStatus == 'Cancelled') {
//         order.orderStatus = req.body.orderStatus;
//         await order.save();

//         order.orderItems.forEach(async orderItem => {
//             await addStock(orderItem._id, orderItem.quantity)
//         })

//         res.status(200).json({
//             success: true
//         })
//     }


// });

// //My Orders(Get Loggedin User Orders) - /api/v1/myorders
// export const myOrders = catchAsyncError(async (req, res, next) => {
//     const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

//     orders.map(order => order.orderItems.map(product => product.image.length > 0 ? product.image = `${process.env.SERVER_URL + product.image}` : undefined));

// res.status(200).json({
//     success: true,
//     orders
// })
// })

// //Admin: Get All Orders - api/v1/admin/orders
// export const orders = catchAsyncError(async (req, res, next) => {
//     const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'fullName email');

//     let totalAmount = 0;

//     orders.forEach(order => {
//         totalAmount += order.totalPrice
//     })

//     orders.map(order => order.orderItems.map(product => product.image.length > 0 ? product.image = `${process.env.SERVER_URL + product.image}` : undefined));

//     res.status(200).json({
//         success: true,
//         totalAmount,
//         orders
//     })
// })

// //Admin: Update Order / Order Status - api/v1/admin/order/:id
// export const updateOrder = catchAsyncError(async (req, res, next) => {
//     const order = await Order.findById(req.params.id);

//     if (order.orderStatus == 'Shipped' && req.body.orderStatus == 'Processing') {
//         return next(new ErrorHandler('Order has been already shipped!', 400))
//     }

//     if (order.orderStatus == 'Delivered') {
//         return next(new ErrorHandler('Order has been already delivered!', 400))
//     }

//     if (order.orderStatus == 'Cancelled') {
//         return next(new ErrorHandler('Order has been already Cancelled!', 400))
//     }

//     order.orderStatus = req.body.orderStatus;
//     if (req.body.orderStatus == 'Delivered') {
//         order.deliveredAt = Date.now();
//     }
//     await order.save();

//     if (req.body.orderStatus == 'Cancelled') {
//         order.orderItems.forEach(async orderItem => {
//             await addStock(orderItem._id, orderItem.quantity)
//         })
//     }

//     res.status(200).json({
//         success: true
//     })

// });


// //Admin: Delete Order - api/v1/admin/order/:id
// export const deleteOrder = catchAsyncError(async (req, res, next) => {
//     const order = await Order.findById(req.params.id);
//     if (!order) {
//         return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404))
//     }

//     await order.remove();
//     res.status(200).json({
//         success: true
//     })
// })

