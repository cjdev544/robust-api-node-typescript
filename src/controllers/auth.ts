import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { User, UserModel } from '../models/user'
import { jwtGenerator } from '../helpers/jwtGenerator'

export interface AuthRequest extends Request {
  uid?: string
  user?: User
}

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email })

    if (!user || !user.state)
      return res.status(404).json({ message: 'User not found' })

    const isCorrectAuth = await bcrypt.compare(password, user.password)
    if (!isCorrectAuth) {
      return res
        .status(404)
        .json({ message: 'email and password do not match' })
    }

    const token = await jwtGenerator(user.id)
    return res.status(200).json({ user, token })
  } catch (error) {
    console.error(error)
    throw new Error('server error')
  }
}
