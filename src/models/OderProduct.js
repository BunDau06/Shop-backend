const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderItems: [
        {
            name: { type: String, required: true },
            amount: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            discount: { type: Number, },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                require: true,
            },
        },
    ],
    shippingAddress: {
        fullname: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        phone: { type: Number, required: true },

    },
    paymentMethod: { type: String, required: true },  // phương thức thanh toán
    itemsPrice: { type: Number, required: true },  // tổng giá sản phẩm
    shippingPrice: { type: Number, required: true },
    // taxPrice: { type: Number, required: true },   // thuế
    totalPrice: { type: Number, required: true },  // tổng tiền
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPaid: { type: Boolean, default: false },  // đã thanh toán chưa
    paidAt: { type: Date },   // thanh toán vào lúc nào
    isDelivered: { type: Boolean, default: false },  // đã giao hàng chưa
    deliveredAt: { type: Date },   // giao hàng vào lúc nào
},
    {
        timestamps: true,
    }
)
const Order = mongoose.model('Order', orderSchema);
module.exports = Order
