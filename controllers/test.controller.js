const formidable = require('formidable')
const { cloudinary } = require('../config/cloudinary')


module.exports = {
    async test(req, res) {
        try {
            const imageFile = req.body.data
            const uploadedResponse = await cloudinary.uploader.upload(imageFile, {
                upload_preset: 'cloud_set'
            })
            console.log(uploadedResponse)
            return res.status(200).json({
                message: 'success',
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error.message
            })
        }

    }
}