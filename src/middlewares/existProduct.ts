import { NextFunction, Response } from 'express'
import { ProductRequest } from '../controllers/products'
import { ProductModel } from '../models/products'

export const existProduct = async (
  req: ProductRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params

  const product = await ProductModel.findById(id)

  if (!product || !product.state)
    return res.status(404).json({ message: 'product not found' })

  next()
  return
}
