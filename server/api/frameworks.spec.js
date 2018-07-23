const { expect } = require('chai');
const request = require('supertest');
const app = require('../../server')
const { session, driver } = require('../db')

describe('Public Routes', () => {

  after('close db session', () => {
    driver.close()
    session.close()
  })

  describe('GET /api/frameworks/latest/votes', () => {
    it('responds with 200 and all votes in the database', async () => {
      await request(app)
        .get('/api/frameworks/latest/votes')
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an('array')
          expect(response.body).to.have.length(4)
        })
    })
  })

  describe('GET /api/frameworks/:countryCode/votes', () => {
    it('responds with 200 and all votes for country US in the database', async () => {
      await request(app)
        .get('/api/frameworks/US/votes')
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an('array')
        })
    })
  })

})
