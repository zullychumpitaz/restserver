const { Router } = require('express');
const { check } = require('express-validator');
const { upload, updateImageCloudinary, showImageCloudinary } = require('../controllers/uploads');
const { validCollections } = require('../helpers');
const { validateJWT, validateFields, validateFile } = require('../middlewares');


const router = Router();

router.post('/',
    [
        validateFile,
        validateJWT
    ],
    upload);

router.put('/:collection/:id',
    [
        validateFile,
        check('id', 'El id debe ser un ID de Mongo').isMongoId(),
        check('collection').custom( c => validCollections( c, ['users', 'products'])),
        validateFields
    ], updateImageCloudinary);

router.get('/:collection/:id',
    [
        check('id', 'El id debe ser un ID de Mongo').isMongoId(),
        check('collection').custom( c => validCollections( c, ['users', 'products'])),
        validateFields
    ], showImageCloudinary);

module.exports = router;