import {createStore, combineReducers, applyMiddleware} from 'redux'
//import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import user from './user'
import githubFrameworks from './github-frameworks'
import userActivity from './user-activity'

const reducer = combineReducers({
  user,
  githubFrameworks,
  userActivity
})

let middlewareTools = [ thunkMiddleware ]

if (process.env.NODE_ENV !== 'production') {
  let createLogger = require('redux-logger')
  middlewareTools = [...middlewareTools, createLogger({collapsed: true})]
}

const middleware = composeWithDevTools(
  applyMiddleware(...middlewareTools)
)
const store = createStore(reducer, middleware)

export default store
export * from './user'
export * from './github-frameworks'
export * from './user-activity'
