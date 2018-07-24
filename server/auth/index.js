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
      CREATE (newuser:User {name: {email}, username: {email}, email: {email}, password: {password}, createdDate: {datetime}, isAdmin: false})-[:LOCATION]->(c)
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

    req.login(user, (err) => {
      if (err) { next(err) }
      res.cookie('atwi', new Date())
      res.json(user)
    })

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

    let query = `MATCH (u:User)
      WHERE u.email = {email}
      RETURN u`

    let response = await session.run(query, {email})
    let user = response.records[0]._fields[0].properties

    const saltedPW = crypto
      .createHash('RSA-SHA256')
      .update(pass)
      .update(user.salt)
      .digest('hex')

    query = `MATCH (u:User)
      WHERE u.email = {email} and u.password = {password}
      RETURN properties(u)`

    response = await session.run(query, {email, password: saltedPW})
    user = response.records[0]._fields[0]

    req.login(user, (err) => {
      if (err) { next(err) }
      res.cookie('atwi', new Date())
      res.json(user)
    })

    driver.close()
    session.close()
  } catch (err) {
    res.status(401).send('User doesn\'t exist or wrong username/password')
  }
})

router.post('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

router.get('/me', (req, res) => {
  res.json(req.user)
})

module.exports = router
