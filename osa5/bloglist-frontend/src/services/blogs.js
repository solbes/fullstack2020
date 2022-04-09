import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newObject, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response
}

const replace = async (id, newObject, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` }
  }

  const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return response
}

const remove = async (id, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` }
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response
}

export default { getAll, create, replace, remove }