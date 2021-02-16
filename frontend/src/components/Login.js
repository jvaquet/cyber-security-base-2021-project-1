import React, { useState } from 'react'
import axios from 'axios'
import {baseUrl} from '../App'


const Login = ({ setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubimt = (e) => {
    e.preventDefault()
    console.log(baseUrl + 'login')
    axios.post(baseUrl + 'login', { username, password })
      .then(res => {
        localStorage.setItem('token', res.data.token)
        setToken(res.data.token)
      }).catch(e => {
      })
  }

  return (
    <div>
      <form onSubmit={handleSubimt}>
        <div>
          username: <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          password: <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' />
        </div>
        <button>login</button>
      </form>
    </div>
  )
}

export default Login