let {session} = require('../db')

const express = require('express')
const router = express.Router()

// GET: /api/frameworks/latest/votes
router.get('/latest/votes', async (req, res, next) => {
  try {

    const query = `
      MATCH (f:Framework)<-[r:FRAMEWORK]-(v:Vote {status: 'latest'})
      RETURN {framework: f.name, votes: count(v)}`

    const data = await session.run(query)

    const votes = data.records.map(record => {
      const info = record._fields[0]
      return { name: info.framework, votes: info.votes.low}
    })

    res.json(votes)
    session.close()
  } catch (err) { next(err) }
})

module.exports = router
