import { Router } from 'express'
import {
  getImgFromParameterInCollection,
  // updateFile,
  uploadFile,
  uploadToCloudinary
} from '../controllers/uploadFile'
import { uploadOneFile } from '../helpers/uploadOneFile'

const router = Router()
const folderName = 'imgs'

const postUpload = uploadOneFile(folderName)

router.post('/', postUpload.single('upload'), uploadFile)

//router.put('/:collection/:parameter', postUpload.single('upload'), updateFile)

router.put(
  '/:collection/:parameter',
  postUpload.single('upload'),
  uploadToCloudinary
)

router.get(
  '/:collection/:parameter',
  getImgFromParameterInCollection(folderName)
)

export default router
