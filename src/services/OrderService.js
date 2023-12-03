const Order = require("../models/OderProduct")
const Product = require("../models/ProductModel")
const EmailService = require("../services/EmailService")

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        console.log('newOrder', newOrder)
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, fullname, totalPrice, address, city, phone, user, isPaid, paidAt, eamil } = newOrder

        try {
            // console.log('orderItems', { orderItems })
            const promises = orderItems.map(async (order) => {
                //tìm sản phẩm có id(product) có số lượng đủ để giảm
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        countInStock: { $gte: order.amount }
                    },
                    {
                        $inc: {
                            countInStock: -order.amount,
                            selled: +order.amount
                        }
                    },

                    { new: true }
                )
                // console.log('productData', productData)

                if (productData) {
                    const createdOrder = await Order.create({
                        orderItems,
                        shippingAddress: {
                            fullname,
                            address,
                            city,
                            phone
                        },
                        paymentMethod,
                        itemsPrice,
                        shippingPrice,
                        totalPrice,
                        user: user,
                        isPaid, paidAt
                    })
                    if (createdOrder) {
                        await EmailService.sendEmailCreateorder(eamil, orderItems)
                        return {
                            status: 'OK',
                            message: 'SUCCESS',
                        }

                    }
                } else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            //tìm xem sản phẩm còn đủ hàng ko
            const results = await Promise.all(promises)
            const newData = results && results.filter((item) => item.id)
            if (newData.length) {
                resolve({
                    status: 'ERR',
                    message: `Sản phẩm với id ${newData.join(',')} đã không còn đủ`,
                })
            }
            // console.log('results', results)

            resolve({
                status: 'OK',
                message: 'SUCCESS',
            })
        } catch (e) {
            console.log('e', e)
            reject(e)
        }
    })
}

const getAllOrderDetails = (id) => {   // nhận được id và data
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({
                user: id
            })
            if (order === null) {
                resolve({
                    status: "OK",
                    message: 'The order is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'Success',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getOrderDetails = (id) => {   // nhận được id và data
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById({
                _id: id
            })
            if (order === null) {
                resolve({
                    status: "OK",
                    message: 'The order is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'Success',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const cancelOrderDetails = (id, data) => {   // nhận được id và data
    return new Promise(async (resolve, reject) => {
        try {
            let order = []
            const promises = data.map(async (order) => {
                //tìm sản phẩm có id(product) có số lượng đủ để giảm
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        selled: { $gte: order.amount }

                    },
                    {
                        $inc: {
                            countInStock: +order.amount,
                            selled: -order.amount
                        }
                    },

                    { new: true }
                )
                // console.log('productData', productData)

                if (productData) {
                    order = await Order.findByIdAndDelete(id)
                    if (order === null) {
                        resolve({
                            status: "OK",
                            message: 'The order is not defined'
                        })
                    }
                } else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            //tìm xem sản phẩm còn đủ hàng ko
            const results = await Promise.all(promises)
            const newData = results && results.filter((item) => item)
            if (newData.length) {
                resolve({
                    status: 'ERR',
                    message: `Sản phẩm với id ${newData.join(',')} không tồn tại`,
                })
            }
            // console.log('results', results)
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: order

            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find()
            resolve({
                status: 'OK',
                message: 'Success',
                data: allOrder
            })
        } catch (e) {
            reject(e)
        }
    })
}



module.exports = {
    createOrder,
    getAllOrderDetails,
    getOrderDetails,
    cancelOrderDetails,
    getAllOrder,
}