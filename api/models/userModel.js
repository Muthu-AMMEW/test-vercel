import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please enter name'],
        trim: true,
        minLength: [4, "Please enter vaild name"]
    },
    email: {
        type: String,
        required: [true, 'Please enter email'],
        trim: true,
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        minLength: [6, 'password must enter atleast 6 characters'],
        select: false
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please enter phone number'],
        minLength:[10, 'Please enter full phone number']
    },
    address: {
        addressLine1: {
            type: String,
            required: true
        },
        addressLine2: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        }
        
    },
    avatar: {
        type: Object
    },
    role: {
        type: String,
        default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}

userSchema.methods.isValidPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.getResetToken = function () {
    //Generate Token
    const token = crypto.randomBytes(20).toString('hex');

    //Generate Hash and set to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    //Set token expire time
    this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;

    return token
}
let userModel = mongoose.model('User', userSchema);


export default userModel;
