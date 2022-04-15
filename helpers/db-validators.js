const Role = require('../models/role');
const User = require('../models/user');

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

module.exports = {
    isRoleValid,
    emailExist,
    userExistByID
}