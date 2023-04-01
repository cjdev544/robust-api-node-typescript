import { Request, Response } from 'express'
import bcrypt from 'bcrypt'

import { User, UserModel } from '../models/user'
import { AuthRequest } from './auth'

export const createUser = async (req: Request, res: Response) => {
  const body = req.body
  const { email, password, name, role, img }: User = body
  try {
    let user = await UserModel.findOne({ email })

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        console.error(err)
        throw new Error('server error')
      }
      const userToSave: User = {
        email,
        name,
        role,
        img,
        password: hash
      }
      user = new UserModel(userToSave)
      await user.save()
      return res.status(201).json({ user })
    })
    return
  } catch (error) {
    console.error(error)
    throw new Error('server error')
  }
}

export const getAllUsers = async (req: Request, res: Response) => {
  const { limit = 5, skip = 0 } = req.query
  const query = { state: true }
  try {
    const totalPromise = UserModel.countDocuments(query)
    const usersPromise = UserModel.find(query).limit(+limit).skip(+skip)

    const [total, users] = await Promise.all([totalPromise, usersPromise])

    return res.status(200).json({ total, users })
  } catch (error) {
    console.error(error)
    throw new Error('server error')
  }
}

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const user = await UserModel.findById(id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    return res.status(200).json({ user })
  } catch (error) {
    console.error(error)
    throw new Error('server error')
  }
}

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { uid, email, password, state, google, ...rest }: User = req.body
  try {
    const userChanged = await UserModel.findByIdAndUpdate(id, rest)
    return res.status(200).json({ userChanged })
  } catch (error) {
    console.error(error)
    throw new Error('server error')
  }
}

export const deleteUser = async (req: AuthRequest, res: Response) => {
  const { id } = req.params
  const { user } = req
  try {
    // await UserModel.findByIdAndDelete(id)
    await UserModel.findByIdAndUpdate(id, { state: false })
    return res.status(200).json({ message: 'User deleted', user })
  } catch (error) {
    console.error(error)
    throw new Error('server error')
  }
}
