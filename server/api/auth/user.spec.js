const { expect } = require('chai')
const request = require('supertest')
const app = require('../../../server')
const { session, driver } = require('../../db')
const crypto = require('crypto')

const user = {
  email: 'testing@user.com',
  password:  '1234',
}

const createTestUser = async () => {
  const salt = crypto.randomBytes(16).toString('base64')
  const password = crypto
    .createHash('RSA-SHA256')
    .update(user.password)
    .update(salt)
    .digest('hex')

  const query = `
  CREATE (newuser:User {name: {email}, email: {email}, password: {password}, salt:{salt}, salt:{salt}, ,  createdDate: timestamp(), isAdmin: false})
    RETURN newuser`

  await session.run(query, { email: user.email, password, salt })
  driver.close()
  session.close()
}

function promisedAuthRequest() {
  const authenticatedagent2b = request.agent(app)
  return new Promise((resolve, reject) => {
    authenticatedagent2b
      .post("/auth/login")
      .send(user)
      .end(function(error, res) {
        if (error) reject(error)
        resolve(authenticatedagent2b)
      })
  })
}

describe("Authed Routes", () => {

  before( async () => {
    await createTestUser()
  })

  after( async () => {
    const query = `MATCH (u:User { email: 'testing@user.com' }) DELETE u`
    await session.run(query)
    driver.close()
    session.close()
  })

  xit('GET: api/auth/user/votes/all/?email=example@email.com', () => {
    return promisedAuthRequest().then(authenticatedagent => {
      const req = authenticatedagent.get(`/api/auth/user/votes/all/?email=${user.email}`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object')
        })
      return req
    })
  })

})
