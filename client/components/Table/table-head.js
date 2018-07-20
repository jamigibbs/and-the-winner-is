import React from 'react'
import PropTypes from 'prop-types'
import { TableHead, TableRow, TableCell, TableSortLabel, Tooltip } from '@material-ui/core'

const columnData = [
  { id: 'fullName', numeric: false, label: 'Framework Name' },
  { id: 'watchersCount', numeric: true, label: 'Watchers Count' },
  { id: 'forksCount', numeric: true, label: 'Forks Count' },
  { id: 'openIssues', numeric: true, label: 'Open Issues' }
]

const CompareTableHead = ({ order, orderBy, onRequestSort }) => {

  const createSortHandler = property => event => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {columnData.map(column => {
          return (
            <TableCell
              key={column.id}
              numeric={column.numeric}
              sortDirection={orderBy === column.id ? order : false}
            >
              <Tooltip
                title="Sort"
                placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                enterDelay={300}
              >
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={order}
                  onClick={createSortHandler(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              </Tooltip>
            </TableCell>
          )
        })}
      </TableRow>
    </TableHead>
  )
}

CompareTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired
}

export default CompareTableHead
