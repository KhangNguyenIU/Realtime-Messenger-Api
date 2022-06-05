const formidable = require('formidable')
const { cloudinary } = require('../config/cloudinary')


module.exports = {
    async test(req, res) {
        try {
           const cached =  cache.get('test')
           console.log(cached)
            console.log(cached)
              if(cached) {
                   return  res.json({
                        message: "cached",
                        data: cached
                    })
                }
                else {
                    res.json({
                        message: "not cached"
                    })
                }
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error.message
            })
        }

    }
}