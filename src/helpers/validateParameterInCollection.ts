import mongoose, { Model } from 'mongoose'
import { UserModel } from '../models/user'
import { ProductModel } from '../models/products'

type MapType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [id: string]: Model<any>
}

const collections: MapType = {
  users: UserModel,
  products: ProductModel
}

export const validateCollectionAndParameter = async (
  collection: string,
  parameter: string
) => {
  {
    if (!collection) return { error: 'collection is required' }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const model: Model<any> | null = collections[collection]

    if (!model) return { error: 'Collection not found' }

    // find parameter by id or name in collection DB
    let parameterInCollection

    try {
      if (!mongoose.Types.ObjectId.isValid(parameter)) {
        return { error: 'parameter is not valid mongo id' }
      }

      parameterInCollection = await model.findById(parameter)

      if (!parameterInCollection) {
        return { error: `Parameter in collection (${collection}) not found` }
      }

      return { data: parameterInCollection }
    } catch (error) {
      console.error(error)
      throw new Error('server error')
    }
  }
}
