import { Schema, model, ObjectId } from 'mongoose'

export interface Category {
  name: string
  state?: string
  user: ObjectId
}

const categorySchema = new Schema<Category>({
  name: {
    type: String,
    required: true
  },
  state: {
    type: Boolean,
    require: true,
    default: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

categorySchema.methods.toJSON = function () {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, __v, state, ...rest } = this.toObject()
  rest.id = _id

  return rest
}

export const CategoryModel = model('Category', categorySchema)
