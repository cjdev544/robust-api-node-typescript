import { NextFunction, Response } from 'express'
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken'
import { ObjectId } from 'mongoose'
import { AuthRequest } from '../controllers/auth'
import { User, UserModel } from '../models/user'

interface Payload extends JwtPayload {
  uid: ObjectId
}

export const jwtValidator = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('x-token')
  if (!token)
    return res.status(401).json({ message: 'there is no token in the request' })

  try {
    const payload = jwt.verify(token, process.env.SECRET_SING as string)
    const uid = (<Payload>payload).uid
    const user = (await UserModel.findById(uid)) as User

    if (!user) return res.status(404).json({ message: 'user not found' })

    if (!user.state)
      return res
        .status(401)
        .json({ message: 'user not found - there is no token in the request' })

    req.user = user
    req.uid = uid
    next()
    return
  } catch (error) {
    return res.status(400).json({ message: (<VerifyErrors>error).message })
  }
}
