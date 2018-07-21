const router = require('express').Router()
module.exports = router

// api/auth/user
router.use('/user', require('./user'))

module.exports = router
