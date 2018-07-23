import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from '@material-ui/core'
import { voteForFramework, getAllFrameworkVotes } from '../../store'

class FrameworkVote extends Component {

  handleVote = async () => {
    const { name, user, userVotes } = this.props
    await this.props.submitUserVote(name, user, userVotes)
    this.props.getFrameworkVotes()
  }

  lastVotedForCheck = (lastFramework, days) => {
    const { name } = this.props
    return days >= 1 && lastFramework === name ||
    days < 1 && lastFramework === name
  }

  votedButtonText = () => {
    const {name, userVotes} = this.props
    const lastFramework = userVotes[userVotes.length - 1].framework
    const days = this.daysSinceLastVote()

    if (this.lastVotedForCheck(lastFramework, days)){
      return `You last voted for ${name}`
    } else if (days >= 1 && lastFramework !== name){
      return `Change vote to ${name}`
    } else if (days < 1 && lastFramework !== name){
      return 'Change vote in 24 hours'
    } else { return null }
  }

  daysSinceLastVote = () => {
    if(this.props.userVotes.length > 0){
      const votes = this.props.userVotes,
        lastVoteTime = votes[votes.length - 1].submitted,
        now = new Date(),
        date2 = new Date(lastVoteTime),
        timeDiff = date2 - now

      return Math.abs( (timeDiff / (1000 * 3600 * 24) ) )
    }
  }

  render(){
    const { name, userVotes } = this.props
    let daysSinceLastVote = this.daysSinceLastVote()
    return (
      <div>
        { userVotes.length === 0 &&
          <Button variant="outlined" size="small" onClick={this.handleVote}>Vote for {name}</Button>
        }

        { userVotes.length > 0 && daysSinceLastVote > 1 &&
          <Button variant="outlined" size="small" onClick={this.handleVote}>
            {this.votedButtonText()}
          </Button>
        }

        { userVotes.length > 0 && daysSinceLastVote < 1 &&
          <Button variant="outlined" size="small" disabled={true}>
            {this.votedButtonText()}
          </Button>
        }

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    submitUserVote: (framework, user, userVotes) => {
      dispatch(voteForFramework(framework, user, userVotes))
    },
    getFrameworkVotes: () => {
      dispatch(getAllFrameworkVotes())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FrameworkVote)
