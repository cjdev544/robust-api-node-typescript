import { ObjectId, Schema, model } from 'mongoose'

export interface Product {
  name: string
  price?: number
  category: ObjectId
  user?: ObjectId
  state?: boolean
  description?: string
  available?: boolean
  img?: string
}

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  state: {
    type: Boolean,
    default: true,
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Category'
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  description: {
    type: String
  },
  available: {
    type: Boolean,
    default: true
  },
  img: {
    type: String
  }
})

productSchema.methods.toJSON = function () {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, __v, state, ...rest } = this.toObject()
  rest.id = _id
  return rest
}

export const ProductModel = model<Product>('product', productSchema)
