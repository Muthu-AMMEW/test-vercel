import catchAsyncError from '../middlewares/catchAsyncError.js';
import User from '../models/userModel.js';
import sendEmail from '../utils/email.js';
import ErrorHandler from '../utils/errorHandler.js';
import { fileDeleter } from '../utils/gridfs/fileDeleter.js';
import sendToken from '../utils/jwt.js';
import crypto from 'crypto';

//Register User - /api/v1/register
export const registerUser = catchAsyncError(async (req, res, next) => {
    const { fullName, email, password, phoneNumber, address } = req.body

    let avatar = {};

    if (req.file) {
        avatar = req.file;
        avatar.image = `/image/user/${req.file.id}`
    }

    const user = await User.create({
        fullName,
        email,
        password,
        phoneNumber,
        address,
        avatar
    });

    user.avatar ? user.avatar.image = `${process.env.SERVER_URL + user.avatar.image}` : undefined;
    sendToken(user, 201, res)

})

//Login User - /api/v1/login
export const loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    //finding the user database
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    if (!await user.isValidPassword(password)) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }
    user.avatar ? user.avatar.image = `${process.env.SERVER_URL + user.avatar.image}` : undefined;
    sendToken(user, 201, res)

})

//Logout User - /api/v1/logout
export const logoutUser = (req, res, next) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        path: '/',
    }).status(200).json({
        success: true,
        message: "Logged out",
    })
}

//Forgot Password - /api/v1/password/forgot
export const forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404))
    }

    const resetToken = user.getResetToken();
    await user.save({ validateBeforeSave: false })

    let BASE_URL = process.env.CLIENT_URL;
    if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }


    //Create reset url
    const resetUrl = `${BASE_URL}/password/reset/${resetToken}`;

    const message = `Your password reset url is as follows \n\n 
    ${resetUrl} \n\n If you have not requested this email, then ignore it.`;

    try {
        sendEmail({
            email: user.email,
            subject: "JVLcart Password Recovery",
            message,
            next
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message), 500)
    }

})

//Reset Password - /api/v1/password/reset/:token
export const resetPassword = catchAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: {
            $gt: Date.now()
        }
    })

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or expired'));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match'));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false })
    user.avatar ? user.avatar.image = `${process.env.SERVER_URL + user.avatar.image}` : undefined;
    sendToken(user, 201, res)

})

//Get User Profile - /api/v1/myprofile
export const getUserProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    user.avatar ? user.avatar.image = `${process.env.SERVER_URL + user.avatar.image}` : undefined;
    res.status(200).json({
        success: true,
        user
    })
})

//Change Password  - api/v1/password/change
export const changePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    //check old password
    if (!await user.isValidPassword(req.body.oldPassword)) {
        return next(new ErrorHandler('Old password is incorrect', 401));
    }

    //assigning new password
    user.password = req.body.password;
    await user.save();
    res.status(200).json({
        success: true,
    })
})

//Update Profile - /api/v1/update
export const updateProfile = catchAsyncError(async (req, res, next) => {
    let newUserData = {
        fullName: req.body.fullName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address
    }

    let avatar = {};

    if (req.file) {
        if (req.user.avatar) {
            fileDeleter(req.user.avatar.id, 'userImages')
        }
        avatar = req.file;
        avatar.image = `/image/user/${req.file.id}`;
        newUserData = { ...newUserData, avatar };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
    })
    user.avatar ? user.avatar.image = `${process.env.SERVER_URL + user.avatar.image}` : undefined;

    res.status(200).json({
        success: true,
        user
    })

})

//Admin: Get All Users - /api/v1/admin/users
export const getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();
    users.map(user => user.avatar ? user.avatar.image = `${process.env.SERVER_URL + user.avatar.image}` : undefined);
    res.status(200).json({
        success: true,
        users
    })
})

//Admin: Get Specific User - api/v1/admin/user/:id
export const getUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
    }
    user.avatar ? user.avatar.image = `${process.env.SERVER_URL + user.avatar.image}` : undefined;
    res.status(200).json({
        success: true,
        user
    })
});

//Admin: Update User - api/v1/admin/user/:id
export const updateUser = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
    })

    user.avatar ? user.avatar.image = `${process.env.SERVER_URL + user.avatar.image}` : undefined;
    res.status(200).json({
        success: true,
        user
    })
})

//Admin: Delete User - api/v1/admin/user/:id
export const deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
    }
    await user.remove();
    res.status(200).json({
        success: true,
    })
})
