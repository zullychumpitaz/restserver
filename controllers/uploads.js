const path = require('path');
const fs = require('fs');

const { response } = require("express");
const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { uploadFile } = require("../helpers");
const { User, Product } = require("../models");


const upload = async( req, res = response) => {

    try {
        // Imágenes
        const name = await uploadFile( req.files, undefined, 'imgs' );
        // .txt, .md
        //const name = await uploadFile( req.files, ['txt','md'], 'text' );
        res.json({ name });
    } catch (error) {
        res.status(400).json({
            msg: error
        })
    }
}

const updateImage = async ( req, res = response) => {
    const { id, collection } = req.params;

    let modelo;

    switch ( collection ) {
        case 'users':
            modelo = await User.findById( id );
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el ID: ${ id }`
                });
            }
            break;
        case 'products':
                modelo = await Product.findById( id );
                if( !modelo ){
                    return res.status(400).json({
                        msg: `No existe un producto con el ID: ${ id }`
                    });
                }
                break;
        default:
            res.status(500).json({ msg: 'Se me olvidó validar esto'});
    }

    // Limpiar imágenes previas
    if( modelo.img ){
        const pathImage = path.join( __dirname, '../uploads', collection, modelo.img);
        if( fs.existsSync( pathImage )){
            fs.unlinkSync( pathImage );
        }
    }

    const nombre = await uploadFile( req.files, undefined, collection );
    modelo.img = nombre;

    await modelo.save();

    res.json({
        modelo
    });
}

const showImage = async (req, res = response) => {
    const { id, collection } = req.params;

    let modelo;

    switch ( collection ) {
        case 'users':
            modelo = await User.findById( id );
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el ID: ${ id }`
                });
            }
            break;
        case 'products':
                modelo = await Product.findById( id );
                if( !modelo ){
                    return res.status(400).json({
                        msg: `No existe un producto con el ID: ${ id }`
                    });
                }
                break;
        default:
            res.status(500).json({ msg: 'Se me olvidó validar esto'});
    }

    if( modelo.img ){
        const pathImage = path.join( __dirname, '../uploads', collection, modelo.img);
        if( fs.existsSync( pathImage )){
            res.sendFile( pathImage );
        }
    }

    const defaultImage = path.join( __dirname, '../assets/no-image.jpg');
    res.sendFile( defaultImage );
}

const updateImageCloudinary = async ( req, res = response) => {
    const { id, collection } = req.params;

    let modelo;

    switch ( collection ) {
        case 'users':
            modelo = await User.findById( id );
            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el ID: ${ id }`
                });
            }
            break;
        case 'products':
                modelo = await Product.findById( id );
                if( !modelo ){
                    return res.status(400).json({
                        msg: `No existe un producto con el ID: ${ id }`
                    });
                }
                break;
        default:
            res.status(500).json({ msg: 'Se me olvidó validar esto'});
    }

    // Limpiar imágenes previas de Cloudinary
    if( modelo.img ){
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');

        cloudinary.uploader.destroy( public_id );
    }

    const { tempFilePath } =  req.files.file;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

    modelo.img = secure_url;
    await modelo.save();

    res.json({
        modelo
    });
}

module.exports = {
    upload,
    updateImage,
    showImage,
    updateImageCloudinary
}