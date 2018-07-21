import axios from 'axios'
const GOT_ALL_USER_VOTES = 'GOT_ALL_USER_VOTES'

const gotAllUserVotes = (votes) => {
  return {
    type: GOT_ALL_USER_VOTES,
    votes
  }
}

export const getAllUserVotes = (email) => {
 return async dispatch => {
   try {
    const { data } = await axios.get('/api/auth/user/votes/all/', {
      params: {
        email
      }
    })
    dispatch(gotAllUserVotes(data))
   } catch (err) { console.log(err)}
 }
}

const initialState = {
  votes: []
}

export default function( state = initialState, action){
  switch (action.type) {
    case GOT_ALL_USER_VOTES:
      return {...state, votes: action.votes}
    default:
      return state
  }
}
