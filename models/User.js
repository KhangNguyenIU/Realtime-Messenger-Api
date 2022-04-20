const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const _ = require('lodash')

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



userSchema.statics.updateUser = async function (email, fields = {}) {
    try {
        const { username, bio, password } = fields
        let user = await this.findByEmail(email)
        if (user){
            const updateUser ={
                ...(username && { username }),
                ...(bio && { bio }),
                ...(password && { password: await bcrypt.hash(password, user.salt) })
            }
            user =_.merge(user, updateUser)
            await user.save()
            return user
        }
    } catch (error) {
        throw "Error occur when update user"
    }

}

//validate password
userSchema.statics.validate = async function (plainPassword, password) {
    return await bcrypt.compare(plainPassword, password)
}

const UserSchema = mongoose.model('user', userSchema)
module.exports = UserSchema