import { Schema, model } from 'mongoose'

export interface User {
  uid?: string
  name: string
  password: string
  email: string
  img?: string
  role: string
  state?: boolean
  google?: boolean
}

const userSchema = new Schema<User>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  img: { type: String },
  role: {
    type: String,
    required: true
  },
  state: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
})

userSchema.methods.toJSON = function () {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __v, password, _id, ...rest } = this.toObject()
  rest.uid = _id
  return rest
}

export const UserModel = model<User>('User', userSchema)
