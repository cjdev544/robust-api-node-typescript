import { NextFunction, Response } from 'express'
import { AuthRequest } from '../controllers/auth'

export const allowedRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user)
      return res.status(500).json({
        message:
          'jwtValidator middleware is required before of call this middleware'
      })

    const userRole = req.user.role

    if (!roles.includes(userRole))
      return res.status(401).json({ message: 'invalid role' })

    next()
    return
  }
}
