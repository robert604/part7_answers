//import { login } from '../services/login'
import React from 'react'
//import { info, errorInfo } from '../utils/logger'
//import blogService from '../services/blogs'

import PropTypes from 'prop-types'
import { setCredentials, loginUser } from '../reducers/credentialsReducer'
import { useDispatch,useSelector } from 'react-redux'
import { Form,Alert } from 'react-bootstrap'



export const Display = ({ displayState,invert=false,style,children }) => {
  style = style ? style : {}
  if((displayState && invert) || (!displayState && !invert)) style.display='none'
  return (
    <div style={style}>
      {children}
    </div>
  )
}

Display.propTypes = {
  displayState: PropTypes.bool.isRequired,
}





export const LoggedOut = () => {
  const dispatch = useDispatch()
  const credentials = useSelector(store => store.credentials)
  const loggedInUser = credentials.user
  const usernameChange = event => {
    const up = { ...credentials, username: event.target.value }
    dispatch(setCredentials(up))
  }
  const passwordChange = event => {
    const up = { ...credentials, password: event.target.value }
    dispatch(setCredentials(up))
  }
  const loginClick = async event => {
    event.preventDefault()
    dispatch(loginUser(credentials))
  }
  if(!loggedInUser) {
    return (
      <Form>
        <Form.Group>
          <h2>Login</h2>
          <div>
            Username: <input id='username' value={credentials.username} onChange={usernameChange} />
          </div>
          <div>
            Password: <input id='password' value={credentials.password} onChange={passwordChange} />
          </div>
          <div>
            <button id='login-button' type='submit' onClick={loginClick}>Login</button>
          </div>
        </Form.Group>
      </Form>
    )
  }
  return null
}





export const Notification = () => {
  const notification = useSelector(store => store.notification)
  if (!notification) return null
  const { text, isError } = notification
  /*const style = {
    color: isError ? 'red' : 'green',
    background: 'lightgrey',
    borderStyle: 'solid',
    borderRadius: '5px',
    marginBottom: '10px',
    padding: '10px',
    fontSize: '20px'
  }*/
  //return <div id='notification' style={style}>{text}</div>
  return(
    <div className='container'>
      <Alert variant={isError ? 'danger' : 'success'}>
        {text}
      </Alert>
    </div>
  )
}

