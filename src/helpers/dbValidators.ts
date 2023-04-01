import { RoleModel } from '../models/roles'
import { UserModel } from '../models/user'

export const isRoleExist = async (role: string) => {
  const existRole = await RoleModel.findOne({ role })
  if (!existRole) throw new Error('Role not found')
}

export const isEmailExist = async (email: string) => {
  const user = await UserModel.findOne({ email })
  if (user) throw new Error('Email is already in use')
}

export const isUserNotExistById = async (id: string) => {
  const user = await UserModel.findById(id)
  if (!user) throw new Error('User not found')
}
