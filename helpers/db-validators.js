const { Category, Role, User, Product } = require('../models');

const isRoleValid = async ( role = '') => {
    const existRole = await Role.findOne({ role });
    if( !existRole ){
        throw new Error(`El rol ${ role } no está registrado en la BD.`);
    }
}

const emailExist = async ( email ) => {
    // Verificar si el correo existe en la BD
    const existEmail = await User.findOne({ email });

    if( existEmail ){
        throw new Error(`El email ${ email } ya está registrado en la BD.`);
    }
}

const userExistByID = async ( id ) => {
    // Verificar si el correo existe en la BD
    const existUser = await User.findById( id );

    if( !existUser ){
        throw new Error(`El ID ${ id } no existe en la BD.`);
    }
}

const categoryExistByID = async ( id ) => {
    // Verificar si el correo existe en la BD
    const existCategory = await Category.findById( id );

    if( !existCategory ){
        throw new Error(`El ID ${ id } no existe en la BD.`);
    }
}

const productExistByID = async ( id ) => {
    // Verificar si el correo existe en la BD
    const existProduct = await Product.findById( id );

    if( !existProduct ){
        throw new Error(`El ID ${ id } no existe en la BD.`);
    }
}

const validCollections = ( collection = '', collections = []) => {
    const isInclude = collections.includes( collection );
    if( !isInclude ){
        throw new Error(`La colección ${ collection } no es permitida. Colecciones permitidas: ${ collections}`)
    }

    return true;
}

module.exports = {
    isRoleValid,
    emailExist,
    userExistByID,
    categoryExistByID,
    productExistByID,
    validCollections
}