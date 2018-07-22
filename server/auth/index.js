const router = require('express').Router()
const crypto = require('crypto')
const { session, driver } = require('../db')

router.post('/signup', async (req, res, next) => {
  try {

    if(req.cookies.atwi){
      res.status(403)
      throw new Error('Please log in to your existing account')
    }

    const now = new Date()
    const datetime = now.toString()
    const email = req.body.email
    const countryCode = req.body.country.code
    const countryName = req.body.country.name
    const salt = crypto.randomBytes(16).toString('base64')
    const password = crypto
      .createHash('RSA-SHA256')
      .update(req.body.password)
      .update(salt)
      .digest('hex')

    const query = `
    MERGE (c:Country {code: {countryCode}, name: {countryName}})
    CREATE (newuser:User {name: {email}, username: {email}, email: {email}, password: {password}, googleId: '', createdDate: {datetime}, isAdmin: false, salt: {salt}})-[:LOCATION]->(c)
    RETURN newuser`

    const response = await session.run(query, {
      email,
      password,
      salt,
      countryCode,
      countryName,
      datetime
    })

    const user = response.records[0]._fields[0].properties

    req.login(user, err => (err ? next(err) : res.json(user)))

    driver.close()
    session.close()
  } catch (err) {
    if (err.code === 'Neo.ClientError.Schema.ConstraintValidationFailed') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const email = req.body.email
    const pass = req.body.password

    //check if user exists
    let query = `
    MATCH (u:User)
    WHERE u.email = {email}
    RETURN u`

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
      response = await session.run(query, {email, password: saltedPW})
    } else {
      // seed file user without salted pw
      query = `MATCH (u:User)
        WHERE u.email = {email} and u.password = {pass}
        RETURN properties(u)
      `
      response = await session.run(query, {email, pass})
    }

    user = response.records[0]._fields[0]

    res.cookie('atwi', new Date())
    req.login(user, err => (err ? next(err) : res.json(user)))

    driver.close()
    session.close()
  } catch (err) {
    res.status(401).send('Wrong username or password')
  }
})

router.post('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

router.get('/me', (req, res) => {
  res.json(req.user)
})

router.use('/google', require('./google'))

module.exports = router
