import React from 'react'
import { Grid, Paper } from '@material-ui/core'

const styles = {
  header: {
    textAlign: 'center',
    fontWeight: 100,
    margin: '40px 0'
  },
  content: {
    width: 900,
    padding: 20,
    lineHeight: 1.6
  }
}

const About = () => {
  return (
    <div>
      <h3 style={styles.header}>About</h3>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={16}>
          <Paper style={styles.content}>
            <p>Evaluating client-side Javascript frameworks can be difficult. This app helps make that process a little bit easier. By comparing the Github repository information for 4 major JS frameworks Ember, React, Angular, and Vue, we can get a better sense of which framework is most actively being developed.</p>
            <p>
              After you sign-up, you'll be able to vote for a framework. You'll be able to change your vote after a 24 hour waiting period. Only your most recent vote will count against the total votes tally.
            </p>
            <p><a href="https://github.com/jamigibbs/and-the-winner-is">View on Github</a></p>
          </Paper>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default About
