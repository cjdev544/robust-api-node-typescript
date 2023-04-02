import { Router } from 'express'
import { check } from 'express-validator'
import { login, loginGoogle } from '../controllers/auth'
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

router.post(
  '/google',
  [check('id_token', 'id_token is required').notEmpty()],
  validationUserFields,
  loginGoogle
)

export default router
