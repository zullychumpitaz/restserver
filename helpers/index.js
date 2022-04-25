const dbValidators = require('./db-validators');
const generarJWT = require('./generarJWT');
const googleVerify = require('./google-verify');
const uploadFile = require('./upload-file');

module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...uploadFile
}