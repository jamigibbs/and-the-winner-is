let {session} = require('../../db')

const express = require('express')
const router = express.Router()

const requireUserLogin = function(req, res, next) {
  if(req.query.email === req.user.email || req.body.user.email === req.user.email){
    next()
  } else {
    res.err("unauthorised")
  }
}

// GET: api/auth/user/votes/all/?email=example@email.com
router.get('/votes/all/', requireUserLogin, async (req, res, next) => {
  try {
    const email = req.query.email

    const query = `MATCH (u:User {email: {email}})-[:VOTED*]-(v:Vote)-[:FRAMEWORK]-(f:Framework)
    RETURN {id: ID(v), submitted: v.createdDate, status: v.status, framework: f.name} as vote`

    const data = await session.run(query, {email})

    const votes = data.records.map(record => {
      const info = record._fields[0]
      return { id: info.id, framework: info.framework, submitted: info.submitted, status: info.status}
    })

    res.json({user: email, votes})
    session.close()
  } catch(err) { next(err) }
})

module.exports = router
