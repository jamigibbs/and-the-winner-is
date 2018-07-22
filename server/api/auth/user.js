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

    res.json({votes})
    session.close()
  } catch(err) { next(err) }
})

// POST: api/auth/user/vote
router.post('/vote', requireUserLogin, async (req, res, next) => {
  try {
    const email = req.body.user.email
    const userVotes = req.body.userVotes
    const framework = req.body.framework

    const now = new Date()
    const dateTime = now.toString()
    let query, data

    if(userVotes.length > 0){
      // Existing user votes
      query = `
        MATCH (u:User {email: {email}}),
        (f:Framework {name: {framework}}),
        (u)-[:VOTED*]->(lastVote:Vote {status: 'latest'})
        SET lastVote.status = 'previous'
        CREATE (newVote:Vote {name:'Vote', status:'latest', createdDate: {dateTime}}),
        (lastVote)-[:VOTED]->(newVote),
        (newVote)-[:FRAMEWORK]->(f)
        RETURN {id: ID(newVote), submitted: newVote.createdDate, status: newVote.status, framework: f.name} as vote`

        data = await session.run(query, {email, framework, dateTime})
    } else {
      //First user vote
      query = `
        MATCH (u:User {email: {email}}),
        (f:Framework {name: {framework}})
        CREATE (newVote:Vote {name:'Vote', status:'latest', createdDate: {dateTime}}),
        (u)-[:VOTED]->(newVote),
        (newVote)-[:FRAMEWORK]->(f)
        RETURN {id: ID(newVote), submitted: newVote.createdDate, status: newVote.status, framework: f.name} as vote`

        data = await session.run(query, {email, framework, dateTime})
    }

    const vote = data.records.map(record => {
      const info = record._fields[0]
      return { id: info.id, framework: info.framework, submitted: info.submitted, status: info.status}
    })

    res.json(vote)
    session.close()
  } catch (err) { next(err) }
})

module.exports = router
