import axios from 'axios'
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
  const resp = await axios.post(baseUrl,newBlog,config)
  return resp.body
}

const toExport = {getAll,addBlog}

export default toExport