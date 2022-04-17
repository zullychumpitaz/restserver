const { response } = require("express");
const { Category } = require('../models');

const createCategory = async( req, res = response ) => {
    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({ name });
    if( categoryDB ){
        return res.status(400).json({
            msg: `La categoría ${ categoryDB.name } ya existe`
        });
    }

    const data = {
        name,
        user: req.user._id,
    }

    const category = await new Category( data );
    await category.save();

    res.status(201).json( category );
}

const getCategories = async( req, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [ total, categories ] = await Promise.all([
        Category.countDocuments( query ),
        Category.find( query )
            .populate('user', 'name')
            .limit( limit )
            .skip( from )
    ]);

    res.json({
        total,
        categories
    })
}

const getCategory = async( req, res = response) => {
    const { id } = req.params;
    const categoryDB = await Category.findById( id ).populate('user', 'name');

    res.json({
        categoryDB
    })
}

const updateCategory = async( req, res = response) => {
    const id = req.params.id;
    const { status, user, ...data } = req.body;

    data.user = req.user;
    data.name = data.name.toUpperCase();

    const categoryDB = await Category.findByIdAndUpdate( id, data, { new: true } );

    res.json({
        categoryDB
    })
}

const deleteCategory = async( req, res = response) => {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate( id, { status: false }, { new: true });

    res.status(200).json({
        category
    })
}

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}