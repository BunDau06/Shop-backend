const jwt = require('jsonwebtoken')  
const dotenv = require('dotenv')
dotenv.config( )

const authMiddleWare = (req, res, next ) => {
    const token = req.headers.token.split(' ')[1]
    jwt.verify(token, process.env.ACCCESS_TOKEN, function (err, user) {   // nhận vào token và shh key trả về funtion err(không có) hoặc decoded(dữ liệu đưa vào)
        if (err) {
            return res.status(404).json({
                message: 'The authemtication ',
                status: 'ERR',
            })
        }
        if(user?.isAdmin) {    // nếu không truyền thì bth
            next()
        } else {
            return res.status(404).json({
                message: 'The authemtication ',
                status: 'ERR',
            })
        }
      })
}

const authUserMiddleWare = (req, res, next ) => {
    const token = req.headers.token.split(' ')[1]
    const userId = req.params.id
    jwt.verify(token, process.env.ACCCESS_TOKEN, function (err, user) {   // nhận vào token và shh key trả về funtion err(không có) hoặc decoded(dữ liệu đưa vào)
        if(err) {
            return res.status(404).json({
                message: 'The authemtication ',
                status: 'ERR',
            })
        }
        if(user?.isAdmin || user?.id === userId) {    // nếu không truyền thì bth
            next()
        } else {
            return res.status(404).json({
                message: 'The authemtication ',
                status: 'ERR',
            })
        }
      })
}

module.exports = {
    authMiddleWare,
    authUserMiddleWare
}