const { request } = require('express');
const { response } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validateJWT = async ( req = request, res = response, next ) => {
    const token = req.header('x-token');

    if( !token ){
        return res.status(401).json({
            msg: 'No hay token en la petición.'
        });
    }

    try {
        const { uid } = jwt.verify( token, process.env.SECRETORPUBLICKEY );
        // Leer el usuario que corresponde al uid
        const authUser = await User.findById( uid );

        if( !authUser ){
            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe en BD.'
            });
        }

        // Verificar si el usuario está activo
        if( ! authUser.status ) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario con status false.'
            });
        }

        req.user = authUser;
        next();

    } catch ( error ) {
        console.log( error );
        return res.status(401).json({
            msg: 'Token inválido.'
        });
    }
}

module.exports = {
    validateJWT
}