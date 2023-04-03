import { NextFunction, Response } from 'express'
import { CategoryModel } from '../models/category'
import { ProductRequest } from '../controllers/products'

export const existCategory = async (
  req: ProductRequest,
  res: Response,
  next: NextFunction
) => {
  const { category } = req.body

  if (!category)
    return res.status(404).json({ message: 'category id is required' })

  const categoryExist = await CategoryModel.findById(category)

  if (!categoryExist)
    return res.status(404).json({ message: 'Category not found' })

  next()
  return
}
