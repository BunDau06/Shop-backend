const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefeshToken } = require("./JwtService")

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                resolve({
                    status: "ERR",
                    message: 'The email is already'
                })
            }
            const hash = bcrypt.hashSync(password, 10)
            // console.log('hash', hash)
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                // confirmPassword: hash, 
                phone
            })
            if (createdUser) {
                resolve({
                    status: 'SUCCESS',
                    message: 'SUCCESS',
                    data: createdUser
                })

            } else {
                return {
                    status: 'ERR',
                    message: 'ERR'
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password, } = userLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                resolve({
                    status: "ERR",
                    message: 'The email is not defined'
                })
            }
            if (!checkUser) {
                resolve(
                    {
                        status: "ERR",
                        message: "the user is not defined"
                    }
                )
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            // console.log('comparePassword', comparePassword) // so sánh password

            if (!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'The passwordor user is incorrect',
                })
            }
            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            const refresh_token = await genneralRefeshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            // console.log('access_token', access_token)
            resolve({
                status: 'SUCCESS',
                message: 'SUCCESS',
                access_token,
                refresh_token
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateUser = (id, data) => {   // nhận được id và data
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: "OK",
                    message: 'The email is not defined'
                })
            }
            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })
            // console.log('updatedUser', updatedUser)
            // const comparePassword = bcrypt.compareSync(password, checkUser.password)
            // // console.log('comparePassword', comparePassword) // so sánh password

            // if(!comparePassword) {
            //     resolve({
            //         status: 'OK',
            //         message: 'The passwordor user is incorrect',
            //     })
            // }
            // const access_token = await genneralAccessToken({
            //     id: checkUser.id,
            //     isAdmin: checkUser.isAdmin
            // })

            // const refresh_token = await genneralRefeshToken({
            //     id: checkUser.id,
            //     isAdmin: checkUser.isAdmin
            // })

            // // console.log('access_token', access_token)
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedUser,
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteUser = (id,) => {   // nhận được id và data
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: "OK",
                    message: 'The user is not defined'
                })
            }
            await User.findByIdAndDelete(id,)
            // console.log('updatedUser', updatedUser)
            // const comparePassword = bcrypt.compareSync(password, checkUser.password)
            // // console.log('comparePassword', comparePassword) // so sánh password

            // if(!comparePassword) {
            //     resolve({
            //         status: 'OK',
            //         message: 'The passwordor user is incorrect',
            //     })
            // }
            // const access_token = await genneralAccessToken({
            //     id: checkUser.id,
            //     isAdmin: checkUser.isAdmin
            // })

            // const refresh_token = await genneralRefeshToken({
            //     id: checkUser.id,
            //     isAdmin: checkUser.isAdmin
            // })

            // // console.log('access_token', access_token)
            resolve({
                status: 'OK',
                message: 'Delete user success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteManyUser = (ids) => {   // nhận được id và data
    return new Promise(async (resolve, reject) => {
        try {
            await User.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete user success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find()
            resolve({
                status: 'OK',
                message: 'Success',
                data: allUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsUser = (id) => {   // nhận được id và data
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: id
            })
            if (user === null) {
                resolve({
                    status: "OK",
                    message: 'The user is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'Success',
                data: user
            })
        } catch (e) {
            reject(e)
        }
    })
}



module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser
}