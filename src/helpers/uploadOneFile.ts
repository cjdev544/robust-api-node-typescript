import { Request } from 'express'
import path from 'path'
import fs from 'fs'
import multer from 'multer'

const validExtDefault = ['.jpg', '.png', '.gif', '.jpeg']

export const uploadOneFile = (
  folder: string,
  validExtFile: string[] = validExtDefault
) => {
  const uploadPath = path.join(__dirname, `../../upload/${folder}`)
  const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
      const { parameter } = req.params
      cb(null, parameter + path.extname(file.originalname))
    }
  })

  return multer({
    storage: storage,
    fileFilter: (_req: Request, file, cb) => {
      const isValidExt = validExtFile.includes(path.extname(file.originalname))
      if (!isValidExt) {
        cb(null, false)
      } else {
        fs.mkdirSync(uploadPath, { recursive: true })
        cb(null, true)
      }
    }
  })
}
