import { Schema, model } from 'mongoose'

export interface Role {
  role: string
}

const roleSchema = new Schema({
  role: {
    type: String,
    require: true
  }
})

export const RoleModel = model('Role', roleSchema)
