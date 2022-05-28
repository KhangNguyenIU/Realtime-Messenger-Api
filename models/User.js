const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const { ACCOUNT_TYPE_USER } = require('../constants')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String
    },
    avatar: {
        type: String,
        default: "https://png.pngtree.com/png-clipart/20190904/original/pngtree-hand-drawn-flat-wind-user-avatar-icon-png-image_4492039.jpg",
        minlength: 0,
        maxlength: 170
    },
    bio: {
        type: String,
        default: "",
        minlength: 0,
        maxlength: 170
    },
    isOnline: { type: Boolean, default: false },
    lastOnline: { type: Date, default: Date.now() },
    accountType: { type: String, default: ACCOUNT_TYPE_USER },
}, { timestamps: true })

userSchema.statics.createUser = async function (username, email, password) {
    try {
        let newUser = { email }
        if (username === "")
            newUser.username = email.split("@")[0]
        else
            newUser.username = username

        newUser.salt = await bcrypt.genSalt(10)
        newUser.password = await bcrypt.hash(password, newUser.salt)
        // console.log({ newUser })
        const user = await this.create(newUser);
        return user;
    } catch (error) {
        throw "Error occur when create user"
    }
}

//find user by email
userSchema.statics.findByEmail = async function (email) {
    try {
        const user = await this.findOne({ email })
        return user;
    } catch (error) {
        throw "Error occur when find user by email"
    }
}

//find user by id
userSchema.statics.findById = async function (id) {
    try {
        const user = await this.findOne({ _id: id })
        return user;
    } catch (error) {
        throw "Error occur when find user by id"
    }
}

userSchema.statics.findByToken = async function (token) {
    try {
        const user = await this.findOne({ _id: token }).select('-password -salt')
        return user;
    } catch (error) {
        throw "Error occur when find user by token"
    }
}


userSchema.statics.updateUser = async function (id, fields = {}) {
    try {
        const { username, bio, password } = fields
        let user = await this.findById(id)
        console.log(user, id)
        if (user) {
            const updateUser = {
                ...(username && { username }),
                ...(bio && { bio }),
                ...(password && { password: await bcrypt.hash(password, user.salt) })
            }
            user = _.merge(user, updateUser)
            await user.save()
            return user
        }
    } catch (error) {
        throw "Error occur when update user"
    }
}

userSchema.statics.updateUserOnlineStatus = async function (id, isOnline) {
    try {
        const user = await this.findById(id)
        if (user) {
            user.isOnline = isOnline
            user.lastOnline = Date.now()
            await user.save()
            return user
        }
    } catch (error) {
        throw "Error occur when update user online status"
    }
}

// Find list of user except current user
userSchema.statics.getUserList = async function (id) {
    try {
        const users = await this.find({ _id: { $ne: id } }).select('-password -salt')
        if (users) {
            return users
        }
        return null
    } catch (error) {
        throw "Error occur when get user list"
    }
}

//validate password
userSchema.statics.validate = async function (plainPassword, password) {
    return await bcrypt.compare(plainPassword, password)
}

const UserSchema = mongoose.model('user', userSchema)
module.exports = UserSchema