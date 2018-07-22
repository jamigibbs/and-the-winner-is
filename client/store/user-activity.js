import axios from 'axios'

const GOT_ALL_USER_VOTES = 'GOT_ALL_USER_VOTES'
const VOTED_FOR_FRAMEWORK = 'VOTED_FOR_FRAMEWORK'

const gotAllUserVotes = votes => ({type: GOT_ALL_USER_VOTES, votes})
const votedForFramework = vote => ({type: VOTED_FOR_FRAMEWORK, vote})

export const getAllUserVotes = (email) => {
 return async dispatch => {
   try {
    const { data } = await axios.get('/api/auth/user/votes/all/', {
      params: { email }
    })
    dispatch(gotAllUserVotes(data.votes))
   } catch (err) { console.log(err)}
 }
}

export const voteForFramework = (framework, user, userVotes) => {
  return async dispatch => {
    try {
      const { data } = await axios.post(`/api/auth/user/vote/`, {
        framework,
        user,
        userVotes
      })
      dispatch(votedForFramework(data))
    } catch (err) { console.log(err) }
  }
}

const initialState = {
  votes: []
}

export default function( state = initialState, action){
  switch (action.type) {
    case GOT_ALL_USER_VOTES:
      return {...state, votes: action.votes}
    case VOTED_FOR_FRAMEWORK: {
      const votes = state.votes.concat(action.vote)
      return {...state, votes}
    }
    default:
      return state
  }
}
