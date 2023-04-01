import mongoose from 'mongoose'

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB as string)
    console.log('💾 Database is connected')
  } catch (error) {
    console.error(error)
    throw new Error('Database Error')
  }
}
