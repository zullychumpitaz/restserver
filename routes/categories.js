const { Router } = require('express');
const { check } = require('express-validator');
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categories');

const { validateFields, validateJWT, isAdminRole } = require('../middlewares');
const { categoryExistByID, isRoleValid } = require('../helpers/db-validators');

const router = Router();

// Listar categorías - público
router.get('/', getCategories);

// Obtener una categoría por ID - público
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( categoryExistByID ),
    validateFields
    ],
    getCategory)

// Crear categoría - privado cualquier rol
router.post('/', [
        validateJWT,
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        validateFields
    ],
    createCategory);

// Actualizar categoría - privado cualquier rol
router.put('/:id', [
        validateJWT,
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        validateFields
    ],
    updateCategory);

// Eliminar categoría - privado sólo ADMIN
router.delete('/:id', [
        validateJWT,
        isAdminRole,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( categoryExistByID ),
        validateFields
    ],
    deleteCategory);

module.exports = router;