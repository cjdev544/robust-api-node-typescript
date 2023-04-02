import { Response } from 'express'
import { AuthRequest } from './auth'
import { CategoryModel } from '../models/category'

export const createCategory = async (req: AuthRequest, res: Response) => {
  const user = req.uid

  try {
    let category = await CategoryModel.findOne({ name: req.body.name })

    if (category)
      return res
        .status(400)
        .json({ message: 'Category is already exist in database' })

    const data = {
      name: req.body.name,
      state: true,
      user
    }

    category = new CategoryModel(data)
    await category.save()
    return res.status(201).json({ category })
  } catch (error) {
    console.error(error)
    throw new Error('server error')
  }
}

export const getAllCategories = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 5, skip = 0 } = req.query
    const query = { state: true }

    const totalPromise = CategoryModel.countDocuments(query)
    const categoryPromise = CategoryModel.find(query)
      .populate('user', ['name', 'email'])
      .limit(+limit)
      .skip(+skip)

    const [total, categories] = await Promise.all([
      totalPromise,
      categoryPromise
    ])

    return res.status(200).json({ total, categories })
  } catch (error) {
    console.error(error)
    throw new Error('server error')
  }
}

export const getCategoryById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const category = await CategoryModel.findById(id).populate('user', [
      'name',
      'email'
    ])

    if (!category)
      return res.status(404).json({ message: 'category not found' })

    return res.status(200).json({ category })
  } catch (error) {
    console.error(error)
    throw new Error('server error')
  }
}

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { name }: { name: string } = req.body

    if (!name)
      return res.status(400).json({ message: 'category name is required' })

    const category = await CategoryModel.findById(id).populate('user', [
      'name',
      'email'
    ])

    if (!category)
      return res.status(404).json({ message: 'category not found' })

    const categoryChanged = await CategoryModel.findByIdAndUpdate(
      id,
      { name: name.trim().toUpperCase(), user: req.uid },
      { new: true }
    )

    return res.status(200).json({ category: categoryChanged })
  } catch (error) {
    console.error(error)
    throw new Error('server error')
  }
}

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const category = await CategoryModel.findById(id)

    if (!category)
      return res.status(404).json({ message: 'category not found' })

    await CategoryModel.findByIdAndUpdate(id, { state: false, user: req.uid })

    return res.status(200).json({ message: 'category deleted' })
  } catch (error) {
    console.error(error)
    throw new Error('server error')
  }
}
