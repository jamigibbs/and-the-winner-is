import React, {Component} from 'react'
import { connect } from 'react-redux'
import { CompareTable } from './Table'
import UserHome from './user-home'
import TotalVotes from './total-votes'
import { CircularProgress } from '@material-ui/core'
import { getAllUserVotes, getAllFrameworkVotes, me } from '../store'

const styles = {
  loader: {
    margin: '0 auto',
    display: 'table',
    marginTop: 40
  }
}

class Home extends Component {

  componentDidMount(){
    this.props.getFrameworkVotes()
    this.props.getUser()
    if(this.props.user.email){
      this.props.getUserVotes(this.props.user.email)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { user } = this.props
    if (nextProps.user !== user && user.email) {
      this.props.getUserVotes(user.email)
    }
  }

  render(){
    const { user, votes, frameworkVotes} = this.props

    if(frameworkVotes.length < 1){ return (
      <CircularProgress style={styles.loader} size={50} />
    )}
    return (
      <div>
        <TotalVotes frameworkVotes={frameworkVotes}/>
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
    votes: state.userActivity.votes,
    frameworkVotes: state.githubFrameworks.frameworkVotes
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserVotes: (user) => {
      dispatch(getAllUserVotes(user))
    },
    getFrameworkVotes: () => {
      dispatch(getAllFrameworkVotes())
    },
    getUser: () => {
      dispatch(me())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
