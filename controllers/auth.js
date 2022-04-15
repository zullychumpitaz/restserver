const { response } = require("express");
const bcryptjs = require("bcryptjs");
const User = require('../models/user');

const { generateJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");

const login = async( req, res = response ) => {
    const { email, password } = req.body;

    try {
        // Verificar si el email existe
        const user = await User.findOne({ email });
        if( !user ){
            return res.status(400).json({
                msg: 'Email / Password no son correctos - email'
            });
        }

        // Verificar si el usuario está activo
        if( !user.status ){
            return res.status(400).json({
                msg: 'Email / Password no son correctos - status:false'
            });
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, user.password );
        if( !validPassword ){
            return res.status(400).json({
                msg: 'Email / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        })
    } catch (error) {
        console.log( error );
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const googleSignIn = async( req, res = response ) => {
    const { id_token } = req.body;

    try {
        const { name, email, img } = await googleVerify( id_token );
        // Verificar si el correo existe en la BD
        let usuario = await User.findOne({ email });

        if( !usuario ){
            // Hay que crear el usuario
            const data = {
                name,
                email,
                img,
                password: ':P',
                google: true,
                role: 'USER_ROLE'
            }

            usuario = new User( data );
            await usuario.save();
        }

        // Si el usuario en BD
        if( !usuario.status ){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        // Generar el JWT
        const token = await generateJWT( usuario.id );

        res.json({
            usuario,
            token
        });
    } catch (error) {
        console.log( error );
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo veerificar'
        })
    }
}

module.exports = {
    login,
    googleSignIn
}