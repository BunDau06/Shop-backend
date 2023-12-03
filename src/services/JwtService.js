const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config()

const genneralAccessToken = async (payload) => {
    // console.log('payload', payload)
    const access_token = jwt.sign({
        ...payload
    }, process.env.ACCCESS_TOKEN, { expiresIn: '30s' }) // thời gian expiresIn này hết hạn

    return access_token
}

const genneralRefeshToken = async (payload) => {
    // console.log('payload', payload)
    const refresh_token = jwt.sign({
        ...payload
    }, process.env.REFRESH_TOKEN, { expiresIn: '365d' }) // thời gian expiresIn này hết hạn

    return refresh_token
}

const refreshTokenJwtService = (token) => {
    return new Promise((resolve, reject) => {
        try {
            // console.log('token', token)
            jwt.verify(token, process.env.REFRESH_TOKEN, async(err, user) => {
                if (err) {
                    resolve({
                        status: 'ERR',
                        message: 'The authemtication'
                    })
                }
                const access_token = await genneralAccessToken({
                    id: user?.id,
                    isAdmin: user?.isAdmin
                })
                // console.log('access_token', access_token)
                resolve({
                    status: 'OK',
                    message: 'Success',
                    access_token
                })
            })
        } catch (e) {    
            reject(e)
        }
    })
   
}

module.exports = {
    genneralAccessToken, 
    genneralRefeshToken,
    refreshTokenJwtService,
}