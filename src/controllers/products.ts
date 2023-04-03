import { Response } from 'express'
import { ObjectId } from 'mongoose'
import { AuthRequest } from './auth'
import { Product, ProductModel } from '../models/products'

export interface ProductRequest extends AuthRequest {
  body: {
    name: string
    category: ObjectId
  }
}

export const createProduct = async (req: ProductRequest, res: Response) => {
  try {
    const { name } = req.body

    const productExist = await ProductModel.findOne({ name })

    if (productExist)
      return res.status(400).json({ message: 'Product already exists' })

    const data: Product = {
      name,
      category: req.body.category,
      user: req.uid || undefined
    }

    const product = new ProductModel<Product>(data)
    await product.save()
    return res.status(201).json(product)
  } catch (error) {
    console.error(error)
    throw new Error('server error')
  }
}

export const getAllProducts = async (req: ProductRequest, res: Response) => {
  const query = { state: true }
  const { limit = '10', skip = 0 } = req.query
  try {
    const totalPromise = ProductModel.countDocuments(query)
    const productsPromise = ProductModel.find(query)
      .limit(+limit)
      .skip(+skip)
      .populate('category', 'name')
      .populate('user', ['email', 'name'])

    const [total, products] = await Promise.all([totalPromise, productsPromise])

    return res.status(200).json({ total, products })
  } catch (error) {
    console.error(error)
    throw new Error('server error')
  }
}

export const getProductById = async (req: ProductRequest, res: Response) => {
  try {
    const { id } = req.params

    const product = await ProductModel.findById(id)
      .populate('category', 'name')
      .populate('user', ['email', 'name'])

    return res.status(200).json({ product })
  } catch (error) {
    console.error(error)
    throw new Error('server error')
  }
}

export const updateProduct = async (req: ProductRequest, res: Response) => {
  try {
    const { id } = req.params
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { state, category, name, ...rest }: Product = req.body

    const product = await ProductModel.findByIdAndUpdate(
      id,
      {
        ...rest,
        category: category,
        name: name.trim().toUpperCase(),
        user: req.uid
      },
      { new: true }
    )

    return res.status(200).json({ product })
  } catch (error) {
    console.error(error)
    throw new Error('server error')
  }
}

export const deleteProduct = async (req: ProductRequest, res: Response) => {
  try {
    const { id } = req.params

    await ProductModel.findByIdAndUpdate(id, { state: false })

    return res.status(200).json({ message: 'delete success' })
  } catch (error) {
    console.error(error)
    throw new Error('server error')
  }
}
