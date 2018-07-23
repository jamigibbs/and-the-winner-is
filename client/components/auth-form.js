import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { countries } from '../countries'
import {Grid, FormControl, Input, InputLabel, Button} from '@material-ui/core'

import { auth } from '../store'

const styles = {
  form: {
    marginTop: 40
  },
  submit: {
    marginTop: 40
  },
  label: {
    color: '#757575',
    marginBottom: 10,
    marginTop: 20
  }
}

const AuthForm = props => {
  const {name, displayName, handleSubmit, error} = props

  return (
    <Grid container spacing={24} direction="row">
      <Grid container item spacing={24} justify="center" >
      <Grid item xs={4} >
      <form style={styles.form} onSubmit={handleSubmit} name={name}>
        <FormControl fullWidth>
          <InputLabel htmlFor="email">Email</InputLabel>
            <Input
              id="email"
              name="email"
              label="Email"
              required={true}
            />
        </FormControl>
        {name === 'signup' &&
          <FormControl fullWidth>
            <p style={styles.label} htmlFor="country">Country</p>
            <Select
              id="countries"
              className="countries"
              classNamePrefix="select"
              isDisabled={false}
              isLoading={false}
              isClearable={true}
              name="country"
              styles={{height: '50px'}}
              options={countries} />
          </FormControl>
        }
        <FormControl fullWidth>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            id="password"
            name="password"
            label="Password"
            required={true}
            inputProps={{ type: 'password' }}
          />
        </FormControl>
        <div>
          <Button
            style={styles.submit}
            type="submit"
            size="large"
            variant="outlined"
          >
            {displayName}
          </Button>
        </div>
        {error && error.response && <div> {error.response.data} </div>}
      </form>

      </Grid>
      </Grid>
    </Grid>
  )
}

const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()

      const countriesElement = document.getElementsByClassName('select__single-value')
      let countryCode = null, countryName = null

      if(countriesElement.length > 0){
        countryName = countriesElement[0].innerText
        countryCode = evt.target.country.value
      }

      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      const country = {code: countryCode, name: countryName}
      dispatch(auth(email, password, country, formName))
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)

AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
