import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableRow, Paper } from '@material-ui/core'
import { CompareTableHead, FrameworkVote } from './'
import { getFrameworksInfo, updatedSortOrder } from '../../store/github-frameworks'
import { nameSplit } from '../../../util'

class CompareTable extends React.Component {

  componentWillMount = () => {
    this.loadData()
    setInterval(this.loadData, 600000) // 10 min
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user) {
      this.loadData()
    }
  }

  loadData = async () => {
    await this.props.fetchFrameworksInfo()
  }

  getSorting = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1)
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'

    if (this.props.orderBy === property && this.props.order === 'desc') {
      order = 'asc'
    }

    this.props.setSortOrder(order, orderBy)
  }

  render() {
    const { frameworksInfo, order, orderBy, user, userVotes } = this.props

    if(this.props.frameworksInfo.length === 0 && !user.email){ return <p>Loading...</p> }
    return (
      <Paper>
        <div>
          <Table aria-labelledby="Compare Popular JS Frameworks">
            <CompareTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
            />
            <TableBody>
              {frameworksInfo
                .sort(this.getSorting(order, orderBy))
                .map(framework => {
                  return (
                    <TableRow key={framework.id}>
                      <TableCell component="th" scope="row">
                        {nameSplit(framework.fullName)}
                      </TableCell>
                      <TableCell numeric>{framework.watchersCount}</TableCell>
                      <TableCell numeric>{framework.forksCount}</TableCell>
                      <TableCell numeric>{framework.openIssues}</TableCell>
                      <TableCell numeric>
                        { !user.name ? (
                            <Link to="/login">
                              Login to vote for {nameSplit(framework.fullName)}
                            </Link>
                          ) : (
                            <FrameworkVote
                              name={nameSplit(framework.fullName)}
                              userVotes={userVotes}
                            />
                          )
                        }
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </div>
      </Paper>
    )
  }
}

CompareTable.propTypes = {
  frameworksInfo: PropTypes.array.isRequired
}

const mapStateToProps = (state) => {
  return {
    frameworksInfo: state.githubFrameworks.frameworksDevInfo,
    order: state.githubFrameworks.order,
    orderBy: state.githubFrameworks.orderBy,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchFrameworksInfo: () => {
      dispatch(getFrameworksInfo())
    },
    setSortOrder: (order, orderBy) => {
      dispatch(updatedSortOrder(order, orderBy))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompareTable)
