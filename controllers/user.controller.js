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
            const { email } = req.params
            const user = await UserSchema.updateUser(email,req.body)
            if(user){
                console.log(user)
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
    }
}