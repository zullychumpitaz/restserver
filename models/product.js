const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    name: {
        type: String,
        required: [ true, 'El nombre es obligatorio' ],
        unique: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price:{
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    available: {
        type: Boolean,
        default: true
    },
    img: {
        type: String,
        default: ""
    }
});

ProductSchema.methods.toJSON = function() {
    const { __v, _id, status, ...product } = this.toObject();
    product.uid = _id;
    return product;
}

module.exports = model( 'Product', ProductSchema );