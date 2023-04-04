import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import { Model } from 'mongoose'
import { validateCollectionAndParameter } from '../helpers/validateParameterInCollection'
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

export const uploadFile = async (req: Request, res: Response) => {
  if (!req.file)
    return res
      .status(400)
      .json({ message: 'there is not file to up or ext file is not valid' })

  return res.status(201).json({ message: 'upload file' })
}

export const updateFile = (folderName: string) => {
  return async (req: Request, res: Response) => {
    if (!req.file)
      return res
        .status(400)
        .json({ message: 'there is not file to up or ext file is not valid' })

    const { collection, parameter } = req.params

    if (!collection || !parameter)
      return res
        .status(400)
        .json({ message: 'collection and parameter in params are required' })

    const validateRes = await validateCollectionAndParameter(
      collection,
      parameter
    )

    if (validateRes.error)
      return res.status(400).json({ message: validateRes.error })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const model: Model<any> | null = collections[collection]

    const document = await model.findById(parameter)

    const dataUpdate = await model.findByIdAndUpdate(
      parameter,
      { img: req.file.filename },
      { new: true }
    )

    if (document.img) {
      const imgDeletePath = path.join(
        __dirname,
        `../../upload/${folderName}/${document.img}`
      )

      fs.unlink(imgDeletePath, (err) => {
        if (err) {
          throw err
        }
      })
    }

    return res.status(201).json({ data: dataUpdate })
  }
}

export const getImageFromParameterInCollection = async (
  req: Request,
  res: Response
) => {
  if (!req.file)
    return res
      .status(400)
      .json({ message: 'there is not file to up or ext file is not valid' })

  return res.status(201).json({ message: 'upload file' })
}

export const getImgFromParameterInCollection = (folderName: string) => {
  return async (req: Request, res: Response) => {
    const { collection, parameter } = req.params

    if (!collection || !parameter)
      return res
        .status(400)
        .json({ message: 'collection and parameter in params are required' })

    const validateRes = await validateCollectionAndParameter(
      collection,
      parameter
    )

    if (validateRes.error)
      return res.status(400).json({ message: validateRes.error })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const model: Model<any> | null = collections[collection]

    const document = await model.findById(parameter)

    if (document.img) {
      const imgPhat = path.join(
        __dirname,
        `../../upload/${folderName}/${document.img}`
      )
      return res.status(200).sendFile(imgPhat)
    } else {
      const imgPhat = path.join(__dirname, '../../upload/no-image.jpg')
      return res.status(200).sendFile(imgPhat)
    }
  }
}
