import { Request, Response } from 'express'
import bcrypt from 'bcrypt'

import { User, UserModel } from '../models/user'
import { jwtGenerator } from '../helpers/jwtGenerator'
import { googleVerify } from '../helpers/googleVerify'

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

export const loginGoogle = async (req: AuthRequest, res: Response) => {
  try {
    const { id_token } = req.body
    const { name, email, picture: img } = await googleVerify(id_token)

    let user = await UserModel.findOne({ email })
    let token: string

    if (!user) {
      const data: User = {
        email: email as string,
        name: name as string,
        password: ':P',
        img: img,
        google: true
      }
      user = new UserModel(data)
      await user.save()
      token = await jwtGenerator(user.id)
    } else {
      const data: User = {
        ...user,
        name: name as string,
        password: 'GOOGLE SIG IN',
        img: img
      }
      if (!user.state)
        return res.status(401).json({ message: 'email been have blocked' })

      await UserModel.findByIdAndUpdate(user.uid, data)
      token = await jwtGenerator(user.id)
    }

    return res.status(200).json({ token, user })
  } catch (error) {
    console.error(error)
    throw new Error('server error')
  }
}
