import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {baseUrl} from '../App'


const Password = ({ token }) => {
  const [password, setPassword] = useState('')
  const [passwordValid, setPasswordValid] = useState(false)

  useEffect(() => {
    setPasswordValid(/^\d{4}$/.test(password))
  }, [password])

  const handleSubimt = (e) => {
    e.preventDefault()
    if(!password)
      return
    const headers = {'Authorization': `bearer ${token}`}
    axios.post(baseUrl + 'password', { password }, { headers})
  }

  return (
    <div>
      <h3>Change your password:</h3>
      <form onSubmit={handleSubimt}>
        <div>
          {passwordValid
            ? <div></div>
            : <div style={{color: 'red'}}>Password must be four digits, just like a banking card - its safe!</div>}
          <div>
            password: <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' />
          </div>
        </div>
        <button>change password</button>
      </form>
    </div>
  )
}

export default Password