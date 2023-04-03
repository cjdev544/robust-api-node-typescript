/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import mongoose, { Model } from 'mongoose'
import { CategoryModel } from '../models/category'
import { UserModel } from '../models/user'
import { ProductModel } from '../models/products'

//const collections = ['users', 'products', 'categories', 'roles']
type MapType = {
  [id: string]: Model<any>
}

const collections: MapType = {
  users: UserModel,
  products: ProductModel,
  categories: CategoryModel
}

export const search = async (req: Request, res: Response) => {
  const { collection, parameter } = req.params

  if (!collection)
    return res.status(400).json({ message: 'collection is required' })

  const model: Model<any> | null = collections[collection]

  if (!model) return res.status(404).json({ message: 'Collection not found' })

  // find parameter by id or name in collection DB
  let parameterInCollection

  try {
    if (mongoose.Types.ObjectId.isValid(parameter)) {
      parameterInCollection = await model.findById(parameter)
    } else {
      const wordSearch = new RegExp(parameter, 'i')

      if (model.modelName !== 'user') {
        parameterInCollection = await model.find({
          name: wordSearch,
          state: true
        })
      } else {
        parameterInCollection = await model.find({
          $or: [{ name: wordSearch }, { email: wordSearch }],
          $and: [{ state: true }]
        })
      }
    }

    if (!parameterInCollection) {
      return res
        .status(404)
        .json({ message: `Parameter in collection "${collection}" not found` })
    }

    return res.status(200).json({ results: [parameterInCollection] })
  } catch (error) {
    console.error(error)
    throw new Error('server error')
  }
}
