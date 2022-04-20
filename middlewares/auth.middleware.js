const jwt = require('jsonwebtoken');
const UserSchema = require('../models/User');
exports.authMidleware = async (req, res, next) => {
    try {
        if (req.headers && req.headers["authorization"]) {
            const token = req.headers["authorization"].split("Bearer ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await UserSchema.findOne({ _id: decoded._id })
            if (user) {
                req.user = decoded._id;
                next();
            }

        } else {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
    }
    catch (error) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
}
