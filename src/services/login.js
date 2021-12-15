import axios from 'axios'

const url = '/api/login'
export const login = async (creds)=>{
  const response = await axios.post(url,creds)
  const data = response.data
  const loggedInUser = {name:data.name,username:data.username,token:data.token}
  return loggedInUser
}
