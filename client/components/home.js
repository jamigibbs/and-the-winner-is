import React, {Component} from 'react'
import { connect } from 'react-redux'
import { CompareTable } from './Table'
import UserHome from './user-home'
import { getAllUserVotes } from '../store/user-activity'

class Home extends Component {

  componentDidMount(){
    if(this.props.user.email){
      this.props.getVotes(this.props.user.email)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user) {
      this.props.getVotes(nextProps.user.email)
    }
  }

  render(){
    const { user, votes} = this.props
    return (
      <div>
        <p>Frameworks List</p>
        <CompareTable
          user={user}
          userVotes={votes}
        />
        { user.email &&
          <UserHome
            user={user}
            userVotes={votes}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    votes: state.userActivity.votes
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getVotes: (user) => {
      dispatch(getAllUserVotes(user))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
