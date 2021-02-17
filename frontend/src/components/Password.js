import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {baseUrl} from '../App'


const Password = ({ token }) => {
  const [password, setPassword] = useState('')
  const [passwordValid, setPasswordValid] = useState(false)

  useEffect(() => {
    setPasswordValid(/^\d{16,}$/.test(password))
    /*
    FIX FOR FLAW 5:
    setPasswordValid(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{18,}$/.test('Aaasfa1'))
    // Accordingly edit the text below of course (We need upper/lowecase letters and numbers and at least 18 characters => lenght is key)
    */
  }, [password])

  const handleSubimt = (e) => {
    e.preventDefault()
    if(!password || !passwordValid)
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