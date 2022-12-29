import axios from 'axios'
import store from '../store/store'
const request = {
  get: (url) => {
    request.headers()
    return request.response(axios.get(`http://${store.state.ip_server}/${url}`))
  },
  post: (url, params = {}) => {
    request.headers()
    return request.response(axios.post(`http://${store.state.ip_server}/${url}`, params))
  },
  put: (url, params = {}) => {
    request.headers()
    return request.response(axios.put(`http://${store.state.ip_server}/${url}`, params))
  },
  patch: (url, params = {}) => {
    request.headers()
    return request.response(axios.patch(`http://${store.state.ip_server}/${url}`, params))
  },
  response: (request) => {
    return new Promise((resolve, reject) => {
      request.then((res) => resolve(res)
        ).catch((err) => {
          console.log('err')
          console.log(err)
          if (err.response.status === 401) {
            localStorage.removeItem('user')
            localStorage.removeItem('access_token')
            localStorage.removeItem('company_id')
            window.location.reload()
            reject(err)
          } else {
            reject(err)
          }
        })
    })
  },
  headers: () => {
    axios.defaults.headers.common['company'] = store.state.company_id
    axios.defaults.headers.common['user'] = store.state.user
    axios.defaults.headers.common['Authorization'] = `Bearer ${store.state.access_token}`
  }
}

export default request
