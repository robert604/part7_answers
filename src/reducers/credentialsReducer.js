import { startNotification } from './notificationReducer'
import { login } from '../services/login'

const initCredentials = { username:'',password:'', user:null }

export const credentialsReducer = (credentials=initCredentials,action) => {
  switch(action.type) {
  case 'SETCREDENTIALS':
    credentials = { ...credentials,
      username: action.username,
      password: action.password
    }
    return credentials
  case 'SETUSER':
    credentials = { ...credentials,
      user:action.user
    }
    return credentials
  case 'LOGIN':
    credentials = { ...credentials,
      username: action.username,
      password: action.password,
      user:action.user
    }
    return credentials
  }
  return credentials
}

export const setCredentials = unameAndPass => {
  return {
    type: 'SETCREDENTIALS',
    username: unameAndPass.username,
    password: unameAndPass.password
  }
}

export const setUser = user => {
  return {
    type: 'SETUSER',
    user: user
  }
}

export const loginUser = (credentials) => {
  return async dispatch => {
    try {
      const user = await login(credentials)
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      dispatch({
        type: 'LOGIN',
        username:'',
        password:'',
        user: user
      })
      dispatch(startNotification({ text: 'Login successful', isError: false }))
    } catch (error) {
      if ('response' in error && error.response.status === 401) {
        dispatch(startNotification({ text: 'wrong username or password', isError: true }))
      } else {
        throw error
      }
    }
  }
}