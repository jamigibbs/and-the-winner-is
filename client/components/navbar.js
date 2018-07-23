import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {AppBar, Toolbar} from '@material-ui/core'
import {logout} from '../store'

const styles = {
  flex: {
    flexGrow: 1
  },
  logo: {
    fontSize: 18
  },
  link: {
    paddingLeft: 20
  }
}

const Navbar = ({handleClick, isLoggedIn, user}) => (
  <div>
    <AppBar position="static" color="default">
    <Toolbar>
      <Link to="/" style={styles.flex}>
        <h1 style={styles.logo}>And the winner is...</h1>
      </Link>
        {isLoggedIn ? (
          <div>
            <span>Hello, {user.email}!</span>
            <a style={styles.link} href="#" onClick={handleClick}>
              Logout
            </a>
          </div>
        ) : (
          <div>
            <Link to="/login">Login</Link>
            <Link style={styles.link} to="/signup">Sign Up</Link>
          </div>
        )}
    </Toolbar>
    </AppBar>
  </div>
)

const mapState = state => {
  return {
    isLoggedIn: !!state.user.email,
    user: state.user
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
