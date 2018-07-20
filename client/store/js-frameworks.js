const fetch = require('node-fetch')

const GOT_ALL_FRAMEWORKS_INFO = 'GOT_ALL_FRAMEWORKS_INFO'

const gotAllFrameworksInfo = (info) => {
  return {
    type: GOT_ALL_FRAMEWORKS_INFO,
    info
  }
}

export const getFrameworksInfo = () => {
  return async dispatch => {
    try {
      const response = await fetch('https://api.github.com/search/repositories?q=repo:angular/angular.js%20repo:facebook/react%20repo:emberjs/ember.js%20repo:vuejs/vue')
      const data = await response.json()
      dispatch(gotAllFrameworksInfo(data.items))
    } catch (err) { console.log(err) }
  }
}

const initialState = {
  frameworksDevInfo: []
}

export default function( state = initialState, action) {
  switch (action.type) {
    case GOT_ALL_FRAMEWORKS_INFO: {
      const activeDevInfo = action.info.map((fw) => {
        return {
          id: fw.id,
          fullName: fw.full_name,
          watchersCount: fw.watchers_count,
          forksCount: fw.forks_count,
          openIssues: fw.open_issues
      }
      })
      return {...state, frameworksDevInfo: activeDevInfo}
    }
    default:
      return state
  }
}
