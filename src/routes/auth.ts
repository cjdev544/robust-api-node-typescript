import { Router } from 'express'
import { check } from 'express-validator'
import { login, loginGoogle } from '../controllers/auth'
import { validationFields } from '../middlewares'

const router = Router()

router.post(
  '/login',
  [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').notEmpty()
  ],
  validationFields,
  login
)

router.post(
  '/google',
  [check('id_token', 'id_token is required').notEmpty()],
  validationFields,
  loginGoogle
)

export default router
