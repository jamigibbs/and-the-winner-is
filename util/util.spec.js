const { expect } = require('chai');
const { nameSplit } = require('./')

describe('Utility Functions', function() {
  describe('string split facebook/react', function() {
    it('it should return the framework name react', function() {
      expect(nameSplit('facebook/react')).to.be.a('string')
      expect(nameSplit('facebook/react')).to.equal('react')
    })
  })
})
