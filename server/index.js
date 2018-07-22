const path = require('path')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const compression = require('compression')
const expressSession = require('express-session')
const passport = require('passport')
const { session } = require('./db')
const PORT = process.env.PORT || 8080
const app = express()
const cookieParser = require('cookie-parser')

if (process.env.NODE_ENV !== 'production') require('../secrets')

// passport registration
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
  // logging middleware
  app.use(morgan('dev'))

  // body parsing middleware
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))

  // compression middleware
  app.use(compression())

  app.use(cookieParser())

  // session middleware with passport
  app.use(
    expressSession({
      secret: process.env.SESSION_SECRET || 'super secret squirrel secret',
      // store: sessionStore,
      resave: false,
      saveUninitialized: false
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())

  // auth and api routes
  app.use('/auth', require('./auth'))
  app.use('/api', require('./api'))

  // static file-serving middleware
  app.use(express.static(path.join(__dirname, '..', 'public')))

  // any remaining requests with an extension (.js, .css, etc.) send 404
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found')
      err.status = 404
      next(err)
    } else {
      next()
    }
  })

  // sends index.html
  app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/index.html'))
  })

  // error handling endware
  app.use((err, req, res, next) => {
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
  })

}

const startListening = () => {
  // start listening (and create a 'server' object representing our server)
  app.listen(PORT, () =>
    console.log(`Mixing it up on port ${PORT}`)
  )
}

async function bootApp() {
  await createApp()
  await startListening()
}
// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec
if (require.main === module) {
  bootApp()
} else {
  createApp()
}

module.exports = app
