import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const uploadFileToCloudinary = async (fileToUp: Express.Multer.File) => {
  // initialize cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
  })

  try {
    const res = await cloudinary.uploader.upload(fileToUp.path, {
      folder: 'teslo-coffee',
      use_filename: true,
      unique_filename: false
    })

    fs.unlink(fileToUp.path, (err) => {
      if (err) throw err
    })

    return res
  } catch (error) {
    console.log(error)
  }
  return null
}
