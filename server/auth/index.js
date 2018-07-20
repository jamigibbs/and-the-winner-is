const router = require('express').Router()
const crypto = require('crypto')
const { session, driver } = require('../db')

router.post('/signup', async (req, res, next) => {
  try {
    const username = req.body.username
    const email = req.body.email
    const salt = crypto.randomBytes(16).toString('base64')
    const password = crypto
      .createHash('RSA-SHA256')
      .update(req.body.password)
      .update(salt)
      .digest('hex')

    const query = `
    CREATE (newuser:User {name: {username}, username: {username}, email: {email}, password: {password}, googleId: '', createdDate: timestamp(), isAdmin: false, salt: {salt}})
    RETURN newuser
  `

    const response = await session.run(query, {
      username,
      email,
      password,
      salt
    })

    const user = response.records[0]._fields[0].properties
    req.login(user, err => (err ? next(err) : res.json(user)))
    driver.close()
    session.close()
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const email = req.body.email
    const password = req.body.password

    //check if user exists
    let query = `
    MATCH (u:User)
    WHERE u.email = {email}
    RETURN u
  `

    let response = await session.run(query, {email})
    let user = response.records[0]._fields[0].properties


    //if the pw is salted in the database
    if (user.salt) {
      const saltedPW = crypto
        .createHash('RSA-SHA256')
        .update(pass)
        .update(user.salt)
        .digest('hex')

      query = `MATCH (u:User)
        WHERE u.email = {email} and u.password = {password}
        RETURN properties(u)
      `
      response = await session.run(query, {name: name, password: saltedPW})
    } else {
      // seed file user without salted pw
      query = `MATCH (u:User)
        WHERE u.email = {email} and u.password = {password}
        RETURN properties(u)
      `
      response = await session.run(query, {email, password})
    }

    user = response.records[0]._fields[0]
    req.login(user, err => (err ? next(err) : res.json(user)))
    driver.close()
    session.close()
  } catch (err) {
    res.status(401).send('Wrong username or password')
  }
})

router.post('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect('/')
})

router.get('/me', (req, res) => {
  res.json(req.user)
})

router.use('/google', require('./google'))

module.exports = router
