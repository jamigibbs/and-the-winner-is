import React from 'react'
import { Button } from '@material-ui/core'

/*
  Logged in, never voted
  Logged in, voted under 24 hours

// If last vote matches name of button, change text to say "voted for react!"
// else text reads "Vote again in 24 hours"

  Logged in, voted over 24 hours
*/

class FrameworkVote extends React.Component {
  handleVote = () => {
    console.log('clicked!')
  }

  votedButtonText = () => { // eslint-disable-line
    const framework = this.props.name
    const userVotes = this.props.userVotes.votes
    const lastVoteFramework = userVotes[userVotes.length - 1].framework
    const daysSinceLastVote = this.daysSinceLastVote()

    // Voted in past but it was over 24 hours
    if (daysSinceLastVote >= 1 && lastVoteFramework === framework){
      return `You last voted for ${framework}`
    }

    if (daysSinceLastVote >= 1 && lastVoteFramework !== framework){
      return `Change vote to ${framework}`
    }

    // Voted in past but it was within 24 hours
    if (daysSinceLastVote < 1 && lastVoteFramework === framework){
      return `You last voted for ${framework}`
    }

    if (daysSinceLastVote < 1 && lastVoteFramework !== framework){
      return 'Vote again in 24 hours'
    }

    return "Missed a condition"
  }

  daysSinceLastVote = () => {
    if(this.props.userVotes.votes.length > 0){
      const votes = this.props.userVotes.votes
      const lastVoteTime = votes[votes.length - 1].submitted
      const now = new Date()
      const date2 = new Date(lastVoteTime)
      const timeDiff = date2 - now

      return Math.abs( (timeDiff / (1000 * 3600 * 24) ) )
    }
  }

  render(){
    const { name, userVotes } = this.props
    let daysSinceLastVote = this.daysSinceLastVote()

    return (
      <div>
        { // never voted
          userVotes.votes.length === 0 &&
            <Button onClick={this.handleVote}>Vote for {name}</Button>
        }

        { // voted in past but last vote is over 24 hours
          userVotes.votes.length > 0 && daysSinceLastVote > 1 &&
            <Button onClick={this.handleVote}>
              {this.votedButtonText()}
            </Button>
        }

        { // Voted in past and last vote is under 24 hours
          userVotes.votes.length > 0 && daysSinceLastVote < 1 &&
          <Button disabled={true}>
            {this.votedButtonText()}
          </Button>
        }

      </div>
    )
  }
}

export default FrameworkVote
