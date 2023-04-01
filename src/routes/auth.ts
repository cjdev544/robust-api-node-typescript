import { Router } from 'express'
import { check } from 'express-validator'
import { login } from '../controllers/auth'
import { validationUserFields } from '../middlewares/validationUserFields'

const router = Router()

router.post(
  '/login',
  [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').notEmpty()
  ],
  validationUserFields,
  login
)

export default router
