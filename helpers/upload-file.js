const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = ( files, validExtensions = ['png', 'jpg', 'jpeg', 'gif'], filePath = '' ) => {

    return new Promise( ( resolve, reject ) => {
        const { file } = files;
        const shortName = file.name.split('.');
        const extension = shortName[ shortName.length - 1 ];

        // Validar la extensión
        if( !validExtensions.includes( extension ) ){
            return reject(`La extensión ${ extension }  no es válida. Sólo se permiten: ${ validExtensions }`);
        }

        const tempName = uuidv4() + '.' + extension;
        const uploadPath = path.join( __dirname, '../uploads/', filePath, tempName ) ;

        file.mv(uploadPath, ( err ) => {
            if ( err ) {
                reject( err );
            }

            resolve( tempName );
        });
    });
}

module.exports = {
    uploadFile
}