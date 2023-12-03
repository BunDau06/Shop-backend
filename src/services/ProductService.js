const Product = require("../models/ProductModel")

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, price, countInStock, rating, description, discount } = newProduct
        try {
            const checkProduct = await Product.findOne({
                name: name
            })
            if (checkProduct !== null) {
                resolve({
                    status: "ERR",
                    message: 'The name of product is already'
                })
            }
            // console.log('hash', hash)
            const newProduct = await Product.create({
                name,
                image,
                type,
                price,
                countInStock: Number(countInStock),
                rating,
                description,
                discount: Number(discount),
            })
            if (newProduct) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: newProduct
                })

            }
        } catch (e) {
            reject(e)
        }
    })
}

const updateProduct = (id, data) => {   // nhận được id và data
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: "OK",
                    message: 'The Product is not defined'
                })
            }
            const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedProduct,
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteProduct = (id,) => {   // nhận được id và data
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: "OK",
                    message: 'The Product is not defined'
                })
            }
            await Product.findByIdAndDelete(id,)
            resolve({
                status: 'OK',
                message: 'Delete Product success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteManyProduct = (ids) => {   // nhận được id và data
    return new Promise(async (resolve, reject) => {
        try {
            await Product.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete Product success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsProduct = (id) => {   // nhận được id và data
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({
                _id: id
            })
            if (product === null) {
                resolve({
                    status: "OK",
                    message: 'The product is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'Success',
                data: product
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllProduct = (limit, page, sort, filter) => {
    // console.log('sort', sort)
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.count()
            let allProduct = []
            // console.log('filter', filter)
            if (filter) {
                const label = filter[0];
                // console.log('label', label)
                // const objectFilter = {}
                // objectFilter[filter[0]] = filter [1]
                const allObjectFilter = await Product.find({ [label]: { '$regex': filter[1] } }).limit(limit).skip(page * limit)
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allObjectFilter,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),    // trả về trang của product
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }
            if (sort) {
                const objectSort = {}
                objectSort[sort[1]] = sort[0]
                const allProductSort = await Product.find().limit(limit).skip(page * limit).sort(objectSort)
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allProductSort,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),    // trả về trang của product
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }
            if (!limit) {
                allProduct = await Product.find()
            } else {
                allProduct = await Product.find().limit(limit).skip(page * limit)
            }

            resolve({
                status: 'OK',
                message: 'Success',
                data: allProduct,
                total: totalProduct,
                pageCurrent: Number(page + 1),    // trả về trang của product
                totalPage: Math.ceil(totalProduct / limit)
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllType = () => {
    // console.log('sort', sort)
    return new Promise(async (resolve, reject) => {
        try {

            const allType = await Product.distinct('type')    // distinct để lấy alltype trong bảng product
            resolve({
                status: 'OK',
                message: 'Success',
                data: allType,
            })
        } catch (e) {
            reject(e)
        }
    })
}






module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteManyProduct,
    getAllType

}