import { Router } from 'express'
import { isAdminUser, jwtValidator, validationFields } from '../middlewares'
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory
} from '../controllers/categories'
import { check } from 'express-validator'

const router = Router()

router.post(
  '/',
  [
    jwtValidator,
    check('name', 'the name of category is required')
      .trim()
      .toUpperCase()
      .notEmpty(),
    validationFields
  ],
  createCategory
)

router.get('/', getAllCategories)

router.get(
  '/:id',
  [
    check('id', 'parameter is not a valid mongoId').isMongoId(),
    validationFields
  ],
  getCategoryById
)

router.put(
  '/:id',
  [
    jwtValidator,
    isAdminUser,
    check('id', 'parameter is not a valid mongoId').isMongoId(),
    validationFields
  ],
  updateCategory
)

router.delete(
  '/:id',
  [
    jwtValidator,
    isAdminUser,
    check('id', 'parameter is not a valid mongoId').isMongoId(),
    validationFields
  ],
  deleteCategory
)

export default router
