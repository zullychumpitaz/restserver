const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateJWT, isAdminRole } = require('../middlewares');
const { categoryExistByID, productExistByID } = require('../helpers/db-validators');
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/products');

const router = Router();

// Listar productos - público
router.get('/', getProducts);

// Obtener un producto por ID - público
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( productExistByID ),
    validateFields
    ],
    getProduct)

// Crear produto - privado cualquier rol
router.post('/', [
        validateJWT,
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('category', 'La categoría no es un ID válido').isMongoId(),
        check('category').custom( categoryExistByID ),
        validateFields
    ],
    createProduct);

// Actualizar produto - privado cualquier rol
router.put('/:id', [
        validateJWT,
        check('category', 'La categoría no es un ID válido').isMongoId(),
        check('category').custom( categoryExistByID ),
        validateFields
    ],
    updateProduct);

// Eliminar produto - privado sólo ADMIN
router.delete('/:id', [
        validateJWT,
        isAdminRole,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( productExistByID ),
        validateFields
    ],
    deleteProduct);


module.exports = router;