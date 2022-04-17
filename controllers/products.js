const { response } = require("express");
const { Product } = require('../models');

const createProduct = async( req, res = response ) => {
    const name = req.body.name.toUpperCase();

    const productDB = await Product.findOne({ name });
    if( productDB ){
        return res.status(400).json({
            msg: `El producto ${ productDB.name } ya existe`
        });
    }

    const { category, price, description, available} = req.body;
    const data = {
        name,
        status: true,
        user: req.user._id,
        price,
        category,
        description,
        available
    }

    const product = await new Product( data );
    await product.save();

    res.status(201).json( product );
}

const getProducts = async( req, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [ total, products ] = await Promise.all([
        Product.countDocuments( query ),
        Product.find( query )
            .populate('user', 'name')
            .populate('category', 'name')
            .limit( limit )
            .skip( from )
    ]);

    res.json({
        total,
        products
    })
}

const getProduct = async( req, res = response) => {
    const { id } = req.params;
    const productDB = await Product.findById( id )
                                .populate('user', 'name')
                                .populate('category', 'name');

    res.json({
        productDB
    })
}

const updateProduct = async( req, res = response) => {
    const id = req.params.id;
    const { status, user, ...data } = req.body;

    if( data.name ){
        data.name = data.name.toUpperCase();
    }

    const productDB = await Product.findByIdAndUpdate( id, data, { new: true } );

    res.json({
        productDB
    })
}

const deleteProduct = async( req, res = response) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate( id, { status: false }, { new: true });

    res.status(200).json({
        product
    })
}

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
}