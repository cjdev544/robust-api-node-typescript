import path from 'path'
import express, { Application } from 'express'
import morgan from 'morgan'

import { dbConnection } from './database/config'
import userRoutes from './routes/users'
import authRoutes from './routes/auth'

class Server {
  #app: Application
  #port: string
  #rootPath: string
  // Routes
  #usersPath: string
  #authPath: string

  constructor() {
    this.#app = express()
    this.#port = process.env.PORT || '3000'
    this.#rootPath = path.dirname(__dirname)
    // Routes
    this.#usersPath = '/api/users'
    this.#authPath = '/api/auth'
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
    this.#app.use(morgan('dev'))
    this.#app.use(express.static(path.join(this.#rootPath, 'public')))
  }

  routes() {
    this.#app.use(this.#usersPath, userRoutes)
    this.#app.use(this.#authPath, authRoutes)
  }

  listen() {
    this.#app.listen(this.#port, () =>
      console.log(`✔ Server listening on port ${this.#port}`)
    )
  }
}

export default Server
