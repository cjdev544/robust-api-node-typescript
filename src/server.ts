import express, { Application } from 'express'
import path from 'path'
import morgan from 'morgan'

import { dbConnection } from './database/config'
import authRoutes from './routes/auth'
import categoriesRoutes from './routes/categories'
import productsRoutes from './routes/products'
import searchRoutes from './routes/search'
import uploadRoutes from './routes/uploadFile'
import userRoutes from './routes/users'

class Server {
  #app: Application
  #port: string
  #rootPath: string
  // Routes
  #authPath: string
  #categoriesPath: string
  #productsPath: string
  #searchPath: string
  #uploadPath: string
  #usersPath: string

  constructor() {
    this.#app = express()
    this.#port = process.env.PORT || '3000'
    this.#rootPath = path.dirname(__dirname)
    // Routes
    this.#authPath = '/api/auth'
    this.#categoriesPath = '/api/categories'
    this.#productsPath = '/api/products'
    this.#searchPath = '/api/search'
    this.#uploadPath = '/api/upload'
    this.#usersPath = '/api/users'

    // Methods
    this.connectDB()
    this.middleware()
    this.routes()
  }

  async connectDB() {
    await dbConnection()
  }

  middleware() {
    this.#app.use(express.json())
    this.#app.use(express.urlencoded({ extended: true }))
    this.#app.use(morgan('dev'))
    this.#app.use(express.static(path.join(this.#rootPath, 'public')))
  }

  routes() {
    this.#app.use(this.#authPath, authRoutes)
    this.#app.use(this.#categoriesPath, categoriesRoutes)
    this.#app.use(this.#productsPath, productsRoutes)
    this.#app.use(this.#searchPath, searchRoutes)
    this.#app.use(this.#uploadPath, uploadRoutes)
    this.#app.use(this.#usersPath, userRoutes)
  }

  listen() {
    this.#app.listen(this.#port, () =>
      console.log(`✔ Server listening on port ${this.#port}`)
    )
  }
}

export default Server
