import Product from '../models/productModel.js';
import ErrorHandler from '../utils/errorHandler.js';
import catchAsyncError from '../middlewares/catchAsyncError.js';
import APIFeatures from '../utils/apiFeatures.js';
import { fileDeleter } from '../utils/gridfs/fileDeleter.js';

//Server quick Start -/api/v1/quickstart
export const quickStart = catchAsyncError(async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Server is up and running!"
    })
})

//Get Products - /api/v1/products
export const getProducts = catchAsyncError(async (req, res, next) => {
    const resPerPage = 8;

    let buildQuery = () => {
        return new APIFeatures(Product.find(), req.query).search().filter()
    }

    const filteredProductsCount = await buildQuery().query.countDocuments({})
    const totalProductsCount = await Product.countDocuments({});
    let productsCount = totalProductsCount;

    if (filteredProductsCount !== totalProductsCount) {
        productsCount = filteredProductsCount;
    }

    const products = await buildQuery().paginate(resPerPage).query;

    products.map(product => product.images.length > 0 ? product.images.map(image => image.image = `${process.env.SERVER_URL + image.image}`) : undefined);

    res.status(200).json({
        success: true,
        count: productsCount,
        resPerPage,
        products
    })
})



//Get Single Product - api/v1/product/:id
export const getSingleProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'fullName email');

    if (!product) {
        return next(new ErrorHandler('Product not found', 400));
    }

    product.images.length > 0 ? product.images.map(image => image.image = `${process.env.SERVER_URL + image.image}`) : undefined;

    res.status(201).json({
        success: true,
        product
    })
})

// //Admin: New Product - /api/v1/admin/product/new
// export const newProduct = catchAsyncError(async (req, res, next) => {
//     let images = [];
    
//     if (req.files.length > 0) {
//         req.files.forEach(file => {
//             file.image = `/image/product/${file.id}`
//             images.push(file)
//         })
//     }

//     req.body.images = images;
//     req.body.user = req.user.id;

//     const product = await Product.create(req.body);
//     product.images.length > 0 ? product.images.map(image => image.image = `${process.env.SERVER_URL + image.image}`) : undefined;
//     res.status(201).json({
//         success: true,
//         product
//     })
// });

// //Admin: Get Admin Products  - api/v1/admin/products
// export const getAdminProducts = catchAsyncError(async (req, res, next) => {
//     const products = await Product.find();

//     products.map(product => product.images.length > 0 ? product.images.map(image => image.image = `${process.env.SERVER_URL + image.image}`) : undefined);
//     res.status(200).send({
//         success: true,
//         products
//     })
// });

// //Admin: Update Product - api/v1/admin/product/:id
// export const updateProduct = catchAsyncError(async (req, res, next) => {
//     let product = await Product.findById(req.params.id);

//     if (!product) {
//         return res.status(404).json({
//             success: false,
//             message: "Product not found"
//         });
//     }


//     //uploading images
//     let images = []

//     //if images not cleared we keep existing images
//     if (req.body.imagesCleared === 'false') {
//         images = product.images;
//     }

//     if (req.body.imagesCleared === 'true') {
//         product.images.forEach(image => {
//             fileDeleter(image.id, 'productImages')
//         })
//         images = [];
//     }

//     if (req.files.length > 0) {
//         req.files.forEach(file => {
//             file.image = `/image/product/${file.id}`
//             images.push(file)
//         })
//     }

//     req.body.images = images;
//     req.body.user = req.user.id;

//     product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true
//     })

//     product.images.length > 0 ? product.images.map(image => image.image = `${process.env.SERVER_URL + image.image}`) : undefined;

//     res.status(200).json({
//         success: true,
//         product
//     })

// })

// //Admin: Delete Product - api/v1/admin/product/:id
// export const deleteProduct = catchAsyncError(async (req, res, next) => {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//         return res.status(404).json({
//             success: false,
//             message: "Product not found"
//         });
//     }

//     if (product.images.length > 0) {
//         product.images.forEach(image => {
//             fileDeleter(image.id, 'productImages')
//         })
//     }

//     await product.remove();

//     res.status(200).json({
//         success: true,
//         message: "Product Deleted!"
//     })

// })

// //Create Review - api/v1/review
// export const createReview = catchAsyncError(async (req, res, next) => {
//     const { productId, rating, comment } = req.body;

//     const review = {
//         user: req.user.id,
//         rating,
//         comment
//     }

//     const product = await Product.findById(productId);
//     //finding user review exists
//     const isReviewed = product.reviews.find(review => {
//         return review.user.toString() == req.user.id.toString()
//     })

//     if (isReviewed) {
//         //updating the  review
//         product.reviews.forEach(review => {
//             if (review.user.toString() == req.user.id.toString()) {
//                 review.comment = comment
//                 review.rating = rating
//             }

//         })

//     } else {
//         //creating the review
//         product.reviews.push(review);
//         product.numOfReviews = product.reviews.length;
//     }
//     //find the average of the product reviews
//     product.ratings = product.reviews.reduce((acc, review) => {
//         return Number(review.rating) + acc;
//     }, 0) / product.reviews.length;
//     product.ratings = isNaN(product.ratings) ? 0 : product.ratings;

//     await product.save({ validateBeforeSave: false });

//     res.status(200).json({
//         success: true
//     })


// })

// //Admin: Get Reviews - api/v1/admin/reviews?id={productId}
// export const getReviews = catchAsyncError(async (req, res, next) => {
//     const product = await Product.findById(req.query.id).populate('reviews.user', 'fullName email');

//     res.status(200).json({
//         success: true,
//         reviews: product.reviews
//     })
// })

// //Admin: Delete Review - api/v1/admin/review
// export const deleteReview = catchAsyncError(async (req, res, next) => {
//     const product = await Product.findById(req.query.productId);

//     //filtering the reviews which does match the deleting review id
//     const reviews = product.reviews.filter(review => {
//         return review._id.toString() !== req.query.id.toString()
//     });
//     //number of reviews 
//     const numOfReviews = reviews.length;

//     //finding the average with the filtered reviews
//     let ratings = reviews.reduce((acc, review) => {
//         return Number(review.rating) + acc;
//     }, 0) / reviews.length;
//     ratings = isNaN(ratings) ? 0 : ratings;

//     //save the product document
//     await Product.findByIdAndUpdate(req.query.productId, {
//         reviews,
//         numOfReviews,
//         ratings
//     })
//     res.status(200).json({
//         success: true
//     })


// });
