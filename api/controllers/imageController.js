// import ErrorHandler from '../utils/errorHandler.js';
// import catchAsyncError from '../middlewares/catchAsyncError.js';
// import { getGFS, getGridFSBucket } from '../utils/gridfs/getStoredImage.js';
// import { userGetGFS, userGetGridFSBucket } from '../utils/gridfs/getStoredUserImage.js';
// import { productGetGFS, productGetGridFSBucket } from '../utils/gridfs/getStoredProductImage.js';
// import { ObjectId } from 'mongodb';
// import { fileDeleter } from '../utils/gridfs/fileDeleter.js';

// //Get images - /image/:id
// export const getImage = catchAsyncError(async (req, res, next) => {
//     const gfs = getGFS();
//     const gridfsBucket = getGridFSBucket();
//     const file = await gfs.files.findOne({ _id: new ObjectId(req.params.id) });

//     if (!file) {
//         return next(new ErrorHandler('No file found with that ID', 404));
//     }
//     if (file.contentType.includes('image/')) {
//         const readstream = gridfsBucket.openDownloadStream(file._id);
//         readstream.pipe(res);

//     } else {
//         return next(new ErrorHandler('File is not an image', 400));
//     }
// })


// //Get user images - /image/user/:id
// export const getUserImage = catchAsyncError(async (req, res, next) => {
//     const userGfs = userGetGFS();
//     const userGridfsBucket = userGetGridFSBucket();
//     const file = await userGfs.files.findOne({ _id: new ObjectId(req.params.id) });

//     if (!file) {
//         return next(new ErrorHandler('No file found with that ID', 404));
//     }
//     if (file.contentType.includes('image/')) {
//         const readstream = userGridfsBucket.openDownloadStream(file._id);
//         readstream.pipe(res);

//     } else {
//         return next(new ErrorHandler('File is not an image', 400));
//     }
// })


// //Get Pouduct images - /image/product/:id
// export const getProductImage = catchAsyncError(async (req, res, next) => {
//     const productGfs = productGetGFS();
//     const productGridfsBucket = productGetGridFSBucket();
//     const file = await productGfs.files.findOne({ _id: new ObjectId(req.params.id) });

//     if (!file) {
//         return next(new ErrorHandler('No file found with that ID', 404));
//     }
//     if (file.contentType.includes('image/')) {
//         const readstream = productGridfsBucket.openDownloadStream(file._id);
//         readstream.pipe(res);

//     } else {
//         return next(new ErrorHandler('File is not an image', 400));
//     }
// })

// //Delete images - /image/:id
// export const deleteFile = catchAsyncError(async (req, res, next) => {
//     const fileId = req.params.id;
//     await fileDeleter(fileId, 'images');
//     res.status(200).json({
//         success: true,
//         message: 'File deleted successfully'
//     })
// })


// //Post Images - /image/:id
// export const postImage = catchAsyncError(async (req, res, next) => {
//     res.send(req.file);
// })