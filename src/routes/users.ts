import { Router } from 'express'
import { check } from 'express-validator'
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser
} from '../controllers/users'
import {
  isEmailExist,
  isRoleExist,
  isUserNotExistById
} from '../helpers/dbValidators'
import {
  allowedRoles,
  isAdminUser,
  jwtValidator,
  validationFields
} from '../middlewares'

const router = Router()

router.post(
  '/',
  [
    check('email', 'Email is not valid').toLowerCase().isEmail(),
    check('email').custom(isEmailExist),
    check('name', 'The name must be at least 2 characters')
      .trim()
      .isLength({ min: 2 }),
    check('password', 'The password must be at least 6 characters')
      .trim()
      .isLength({ min: 6 }),
    check('role').custom(isRoleExist)
  ],
  validationFields,
  createUser
)

router.delete(
  '/:id',
  [
    jwtValidator,
    isAdminUser,
    allowedRoles('ADMIN_ROLE'),
    check('id', 'Id is not valid').isMongoId(),
    check('id', 'User not found').custom(isUserNotExistById)
  ],
  validationFields,
  deleteUser
)

router.get('/', getAllUsers)

router.get(
  '/:id',
  [check('id', 'Id is not valid').isMongoId()],
  validationFields,
  getUser
)

router.put(
  '/:id',
  [
    check('email', 'Email is not valid').toLowerCase().isEmail(),
    check('email').custom(isEmailExist),
    check('name', 'The name must be at least 2 characters')
      .trim()
      .isLength({ min: 2 }),
    check('id', 'Id is not valid').isMongoId(),
    check('id', 'User not found').custom(isUserNotExistById),
    check('role').custom(isRoleExist)
  ],
  validationFields,
  updateUser
)

export default router
