import React from 'react'

const TotalVotes = ({ frameworkVotes }) => {
  return (
    <div>
      <h3>Total Votes</h3>
      <ul>
      {frameworkVotes.map((framework) => {
        return (
          <li key={framework.name}>
            {framework.name} - {framework.votes}
          </li>
        )
      })}
      </ul>
    </div>
  )
}

export default TotalVotes
