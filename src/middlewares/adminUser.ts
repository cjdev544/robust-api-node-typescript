import { NextFunction, Response } from 'express'
import { AuthRequest } from '../controllers/auth'

export const isAdminUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user)
    return res.status(500).json({
      message:
        'jwtValidator middleware is required before of call this middleware'
    })

  if (req.user?.role !== 'ADMIN_ROLE')
    return res.status(401).json({ message: 'unauthorized rol user' })
  next()
  return
}
