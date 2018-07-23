import React from 'react'
import { Grid, Table, TableHead, TableBody, TableCell, TableRow, Paper } from '@material-ui/core'

const styles = {
  header: {
    textAlign: 'center',
    fontWeight: 100,
    margin: '40px 0'
  },
  info: {
    textAlign: 'center'
  },
  table: {
    width: 700,
    marginTop: 40
  }
}

const UserHome = ({ userVotes}) => {
  return (
    <div>
      <h3 style={styles.header}>Your Voting History</h3>
      <p style={styles.info}>You can change your vote after 24 hours but only your most recent vote will count against the overall framework totals</p>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={16}>
            <Paper style={styles.table}>
            { userVotes.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Framework</TableCell>
                    <TableCell numeric>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userVotes.map(vote => {
                      return (
                        <TableRow key={vote.framework}>
                          <TableCell component="th" scope="row">
                            {vote.framework}
                          </TableCell>
                          <TableCell numeric>{vote.submitted}</TableCell>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
            ) : (<p style={styles.info}>You haven't voted yet</p>)}
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default UserHome
