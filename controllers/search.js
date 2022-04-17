const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;
const { Category, Product, User } = require('../models');

const collectionsValids = [
    'categories',
    'products',
    'roles',
    'users'
]

const searchUsers = async ( term = '', res = response) => {
    const isMongoID = ObjectId.isValid( term );
    if( isMongoID ){
        const user = await User.findById( term );
        return res.json({
            results: ( user ) ? [ user ] : []
        });
    }

    const regex = new RegExp( term, 'i' );

    const users = await User.find({
        $or: [
            { name: regex },
            { email: regex }
        ],
        $and: [{ status: true }]
    });
    return res.json({
        results: users
    });
}

const searchCategories = async ( term = '', res = response) => {
    const isMongoID = ObjectId.isValid( term );
    if( isMongoID ){
        const category = await Category.findById( term );
        return res.json({
            results: ( category ) ? [ category ] : []
        });
    }

    const regex = new RegExp( term, 'i' );

    const categories = await Category.find({ name: regex, status: true });
    return res.json({
        results: categories
    });
}

const searchProducts = async ( term = '', res = response) => {
    const isMongoID = ObjectId.isValid( term );
    if( isMongoID ){
        const product = await Product.findById( term )
                            .populate('category', 'name');
        return res.json({
            results: ( product ) ? [ product ] : []
        });
    }

    const regex = new RegExp( term, 'i' );

    const products = await Product.find({
        $or: [
            { name: regex },
            { description: regex }
        ],
        $and: [{ status: true }]
    })
    .populate('category', 'name');;
    return res.json({
        results: products
    });
}

const search = (req = request, res = response) => {
    const { collection, term } = req.params;

    if( !collectionsValids.includes( collection ) ) {
        return res.status( 400 ).json({
            msg: `Las colecciones permitidas son: ${ collectionsValids }`
        });
    }

    switch ( collection ) {
        case 'categories':
            searchCategories( term, res );
        break;
        case 'products':
            searchProducts( term, res );
        break;
        case 'users':
            searchUsers( term, res );
        break;
        default:
            res.status(500).json({
                msg: 'Se me olvidó hacer esta búsqueda'
            })
        break;
    }
}

module.exports = {
    search
}