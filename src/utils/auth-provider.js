import {fetchUtils} from 'ra-core'
import JwtDecode from 'jwt-decode'

let accessToken = ''

const authProvider = {
  // authentication
  async login({email, password}) {
    const request = new Request('http://localhost:5000/api/users/login', {
      method: 'POST',
      body: JSON.stringify({email, password}),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
    return fetch(request)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText)
        }
        return response.json()
      })
      .then(auth => {
        accessToken = auth.accessToken
        localStorage.setItem('refresh-token', auth.refreshToken)
      })
      .catch(() => {
        throw new Error('Network error')
      })
  },
  checkError: error => Promise.resolve(),
  async checkAuth(params) {
    try {
      const {exp} = JwtDecode(accessToken)
      if (Date.now() >= exp * 1000) {
        accessToken = await this.refreshAccessToken()
      }
    } catch (err) {
      throw new Error(`Permission denied, please login to contiue`)
    }
    return Boolean(accessToken)
  },
  async refreshAccessToken() {
    const refreshToken = localStorage.getItem('refresh-token')

    const request = new Request(
      'http://localhost:5000/api/users/refresh-token',
      {
        method: 'POST',
        body: JSON.stringify({refreshToken}),
        headers: new Headers({'Content-Type': 'application/json'}),
      },
    )
    return fetch(request)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText)
        }
        return response.json()
      })
      .then(auth => {
        accessToken = auth.accessToken
        localStorage.setItem('refresh-token', auth.refreshToken)
        return accessToken
      })
      .catch(() => {
        throw new Error('Network error')
      })
  },
  async logout() {
    accessToken = ''
    localStorage.removeItem('refresh-token')
    return
  },
  async getIdentity() {
    return fetch('http://localhost:5000/api/users/me', {
      headers: {Authorization: `Bearer ${accessToken}`},
    })
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText)
        }
        return response.json()
      })
      .then(data => {
        const {name: fullName} = data
        return {fullName}
      })
  },
  // authorization
  getPermissions: params => Promise.resolve(),
}

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({Accept: 'application/json'})
  }

  options.headers.set('Authorization', `Bearer ${accessToken}`)
  return fetchUtils.fetchJson(url, options)
}

export {authProvider, httpClient}
