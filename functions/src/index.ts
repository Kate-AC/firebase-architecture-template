import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { AuthPresenter } from 'presenter/auth.presenter'
import { HomePresenter } from 'presenter/home.presenter'
import { ValidateAccessTokenUsecase } from 'usecase/middleware/validate.access.token.usecase'

admin.initializeApp()

const app = express()
app.use(cookieParser())
app.use(
  cors({
    origin: [process.env.FRONT_URL],
    methods: 'GET, POST, OPTIONS',
    allowedHeaders: 'Authorization, Accept, Content-Type, Cookie',
    maxAge: 3600,
    credentials: true,
    optionsSuccessStatus: 204,
  })
)

app.use(async (req, res, next) => {
  if (['/login'].includes(req.path)) {
    return next()
  }

  const validateAccessTokenUsecase = new ValidateAccessTokenUsecase()

  try {
    const id = await validateAccessTokenUsecase.validateAccessToken(req.cookies)
    res.locals.id = id
    next()
  } catch (e) {
    res.status(302).send({ redirectUrl: process.env.FRONT_URL })
  }
})

/**
 * Auth
 */

export const auth = functions
  .region('asia-northeast1')
  .https
  .onRequest((request, response) => {
    const authPresenter = new AuthPresenter()
    app.post('/login', async (req, res) => await authPresenter.login(req, res))
    app(request, response)
  })

/**
 * Home
 */

export const home = functions
  .region('asia-northeast1')
  .https
  .onRequest((request, response) => {
    const homePresenter = new HomePresenter()
    app.post('/', async (req, res) => await homePresenter.home(req, res))
    app(request, response)
  })
