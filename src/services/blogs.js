import axios from 'axios'
//import { info } from '../utils/logger'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const addBlog = async (loggedInUser,newBlog)=>{
  const config = {
    headers:{
      Authorization:`Bearer ${loggedInUser.token}`
    }
  }
  try {
    const resp = await axios.post(baseUrl,newBlog,config)
    return resp.data    
  } catch(error) {
    throw new Error(JSON.stringify(error.response.data))
  }
}

const toExport = {getAll,addBlog}

export default toExport