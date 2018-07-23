import React from 'react'
import { Card, Grid } from '@material-ui/core'

const styles = {
  card: {
    width: 200,
    marginTop: 40
  },
  name: {
    fontWeight: 100,
    fontSize: 16,
    textAlign: 'center'
  },
  votes: {
    fontWeight: 100,
    fontSize: 46,
    marginTop: 20,
    textAlign: 'center'
  },
  logo: {
    margin: '0 auto',
    display: 'table',
    marginTop: 10
  }
}

const TotalVotes = ({ frameworkVotes }) => {
  return (
    <Grid container spacing={16}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={16}>
        {frameworkVotes.map((framework) => {
          console.log('framework.name', framework.name)
          return (
            <Grid key={framework.name} item>
              <Card style={styles.card}>
                <img style={styles.logo}width={75} src={`img/${framework.name}.png`} alt={framework.name} />
                <h2 style={styles.name}>{framework.name}</h2>
                <h3 style={styles.votes}>{framework.votes}</h3>
              </Card>
            </Grid>
          )
        })}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default TotalVotes
