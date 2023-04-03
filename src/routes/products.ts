import { Router } from 'express'
import { check } from 'express-validator'
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct
} from '../controllers/products'
import { isAdminUser, jwtValidator, validationFields } from '../middlewares'
import { existCategory } from '../middlewares/existCategory'
import { existProduct } from '../middlewares/existProduct'

const router = Router()

router.post(
  '/',
  [
    jwtValidator,
    existCategory,
    check('name', 'Product name is required').trim().toUpperCase().notEmpty(),
    validationFields
  ],
  createProduct
)

router.get('/', getAllProducts)

router.get(
  '/:id',
  [check('id', 'Id is not valid').isMongoId(), validationFields],
  getProductById
)

router.put(
  '/:id',
  [
    jwtValidator,
    isAdminUser,
    existCategory,
    check('id', 'Id is not valid').isMongoId(),
    existProduct,
    validationFields
  ],
  updateProduct
)

router.delete(
  '/:id',
  [
    jwtValidator,
    isAdminUser,
    check('id', 'Id is not valid').isMongoId(),
    existProduct,
    validationFields
  ],
  deleteProduct
)

export default router
