const { errorHandler } = require("../handler/DBhandler");
const UserSchema = require("../models/User");

module.exports = {
    getUserByEmail: async (req, res) => {
        try {
            const { email } = req.params;
            const user = await UserSchema.findByEmail(email)
            
            if (user) {
                return res.status(200).json({
                    user
                })
            }
            return res.status(404).json({
                message: `User with email : ${email} not found`
            })
           
        } catch (error) {
            return res.status(400).json({
                message: errorHandler(error)
            })
        }
    },

    updateUser: async (req, res) => {
        try {
            const { id } = req.params
            const user = await UserSchema.updateUser(id,req.body)
            if(user){
                console.log(user)
                return res.status(200).json({
                    message: "Update success",
                })
            }
            return res.status(404).json({
                error: `User with email : ${email} not found`
            })
        } catch (error) {
            return res.status(400).json({
                error: errorHandler(error)
            })
        }
    },
    updateUserOnlineStatus: async (req, res) => {
        try {
            const { id } = req.params
            const isOnline = req.body.isOnline || false
            const user = await UserSchema.updateUserOnlineStatus(id,isOnline)
            if(user){
                console.log(user)
                return res.status(200).json({
                    message: "Update success",
                })
            }
            return res.status(404).json({
                error: `User not Found`
            })
        } catch (error) {
            return res.status(500).json({
                error: errorHandler(error)
            })
        }
    },
    getUserList: async (req, res) => {
        try {
            console.log("hello")
            const userList = await UserSchema.getUserList(req.user)
            return res.status(200).json({
                users: userList
            })
        } catch (error) {
            return res.status(400).json({
                error: errorHandler(error)
            })
        }
    }
}