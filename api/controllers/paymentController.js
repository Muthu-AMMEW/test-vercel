// import catchAsyncError from '../middlewares/catchAsyncError.js';
// import Stripe from 'stripe';

// export const processPayment = catchAsyncError(async (req, res, next) => {
//     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
//     const paymentIntent = await stripe.paymentIntents.create({
//         amount: req.body.amount,
//         currency: "inr",
//         description: "TEST PAYMENT",
//         metadata: { integration_check: "accept_payment" },
//         shipping: req.body.shipping
//     })

//     res.status(200).json({
//         success: true,
//         client_secret: paymentIntent.client_secret
//     })
// })

// export const sendStripeApi = catchAsyncError(async (req, res, next) => {
//     res.status(200).json({
//         stripeApiKey: process.env.STRIPE_API_KEY
//     })
// })

