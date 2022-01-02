import { createStore } from 'redux'

const initCredentials = { username:'',password:'', user:null }

const credentialsReducer = (credentials=initCredentials,action) => {
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

export const credentialsStore = createStore(credentialsReducer)

