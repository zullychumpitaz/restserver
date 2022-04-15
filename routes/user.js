const { Router } = require('express');
const { check } = require('express-validator');

const { usersGet, usersPut, usersPost, usersDelete, usersPatch } = require('../controllers/users');
const { validateFields, validateJWT, isAdminRole, hasRole } = require('../middlewares');
const { isRoleValid, emailExist, userExistByID } = require('../helpers/db-validators');

const router = Router();

router.get('/', usersGet);

router.post( '/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom( emailExist ),
    check('password', 'El password debe tener más de 6 dígitos').isLength({ min: 6 }),
    //check('role', 'El rol no es válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom( isRoleValid ),
    validateFields
], usersPost );

router.put( '/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( userExistByID ),
    check('role').custom( isRoleValid ),
    validateFields
],
usersPut );

router.patch( '/', usersPatch );

router.delete( '/:id', [
    validateJWT,
    // isAdminRole,
    hasRole('USER_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( userExistByID ),
    validateFields
], usersDelete );


module.exports = router;