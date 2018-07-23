const path = require('path')
const express = require('express')
const app = express()

const passport = require('passport')
const expressSession = require('express-session')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const compression = require('compression')
const cookieParser = require('cookie-parser')

const { session } = require('./db')
const PORT = process.env.PORT || 8080

if (process.env.NODE_ENV !== 'production') require('../secrets')

passport.serializeUser( (user, done) => done(null, user.email))

passport.deserializeUser(async (email, done) => {
  try {
    const query = 'MATCH (u:User) WHERE u.email = {email} RETURN u'
    const response = await session.run(query, {email})
    const user = await response.records[0]._fields[0].properties
    done(null, user)
  } catch (err) {
    done(err)
  }
})

const createApp = () => {

  app.use(morgan('dev'))

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))

  app.use(compression())

  app.use(cookieParser())

  app.use(
    expressSession({
      secret: process.env.SESSION_SECRET || 'super secret squirrel secret'
    })
  )

  app.use(passport.initialize())
  app.use(passport.session())

  app.use('/auth', require('./auth'))
  app.use('/api', require('./api'))

  app.use(express.static(path.join(__dirname, '..', 'public')))

  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found')
      err.status = 404
      next(err)
    } else { next() }
  })

  app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/index.html'))
  })

  app.use((err, req, res, next) => {
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
  })
}

const startListening = () => {
  app.listen(PORT, () =>
    console.log(`Mixing it up on port ${PORT}`)
  )
}

async function bootApp() {
  await createApp()
  await startListening()
}

if (require.main === module) {
  bootApp()
} else {
  createApp()
}

module.exports = app
