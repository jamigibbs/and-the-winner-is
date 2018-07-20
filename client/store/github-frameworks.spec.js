import {expect} from 'chai'
import { getFrameworksInfo, updatedSortOrder } from './github-frameworks'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import configureMockStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'
const middlewares = [thunkMiddleware]
const mockStore = configureMockStore(middlewares)
const githubUrl = 'https://api.github.com/search/repositories?q=repo:angular/angular.js%20repo:facebook/react%20repo:emberjs/ember.js%20repo:vuejs/vue'

describe('thunk creators', () => {
  let store
  let mockAxios

  const initialState = {frameworksDevInfo: [], order: 'asc', orderBy: 'fullName'}

  beforeEach(() => {
    mockAxios = new MockAdapter(axios)
    store = mockStore(initialState)
  })

  afterEach(() => {
    mockAxios.restore()
    store.clearActions()
  })

  describe('getFrameworksInfo', () => {
    it('dispatches the GOT_ALL_FRAMEWORKS_INFO action and sets store info', async () => {
      mockAxios.onGet(githubUrl).replyOnce(200)
      await store.dispatch(getFrameworksInfo())
      const actions = store.getActions()
      expect(actions[0].type).to.be.equal('GOT_ALL_FRAMEWORKS_INFO')
      expect(actions[0].info).to.be.an('array')
      expect(actions[0].info).to.have.length(4)
    })
  })

  describe('updatedSortOrder', () => {
    it('dispatches the UPDATED_SORT_ORDER action and sets sort info', async () => {
      await store.dispatch(updatedSortOrder('desc', 'openIssues'))
      const actions = store.getActions()
      expect(actions[0].type).to.be.equal('UPDATED_SORT_ORDER')
      expect(actions[0].order).to.be.an('string')
      expect(actions[0].orderBy).to.be.an('string')
      expect(actions[0].order).to.be.equal('desc')
      expect(actions[0].orderBy).to.be.equal('openIssues')
    })
  })

})
