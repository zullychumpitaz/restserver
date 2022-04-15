const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');


const usersGet = async (req = request, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [ total, users ] = await Promise.all([
        User.countDocuments( query ),
        User.find( query )
            .limit( limit )
            .skip( from )
    ]);

    res.json({
        total,
        users
    })
}

const usersPost = async (req, res = response) => {
    const { name, email, password, role } = req.body;
    const usuario = new User({ name, email, password, role });

    // Encriptar el password
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // Guardar en la BD
    await usuario.save();

    res.json({
        usuario
    })
}

const usersPut = async (req, res = response) => {
    const id = req.params.id;
    const { _id, password, google, ...resto } = req.body;

    if( password ){
        // Encriptar el password
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const userDB = await User.findByIdAndUpdate( id, resto );

    res.json({
        userDB
    })
}

const usersPatch = (req, res = response) => {
    res.json({
        msg: 'patch API Controller'
    })
}

const usersDelete = async(req, res = response) => {
    const id = req.params.id;

    // Eliminar físicamente
    //const user = await User.findByIdAndDelete( id );

    const user = await User.findByIdAndUpdate( id, { status: false });

    res.json({
        id,
        user
    })
}

module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete
}