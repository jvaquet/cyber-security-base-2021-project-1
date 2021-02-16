import React, { useState } from 'react'
import axios from 'axios'
import {baseUrl} from '../App'
import jwt from 'jwt-decode'


const Like = ({ users, token }) => {
  const [user, setUser] = useState('')

  const handleSubimt = (e) => {
    e.preventDefault()
    if(!user)
      return
    const headers = {'Authorization': `bearer ${token}`}
    axios.post(baseUrl + 'likes', { user }, { headers})
  }
  const loggedInUser = jwt(token).username
  const filteredUsers = users.filter(u => u !== loggedInUser)

  return (
    <div>
      <h3>Give Likes to others!</h3>
      <form onSubmit={handleSubimt}>
        <div>
          user:
          <select name='user' id='user' value={user} onChange={e => setUser(e.target.value)}>
            {filteredUsers.map(user => <option key={user} value={user}>{user}</option>)}
          </select>
        </div>
        <button>like</button>
      </form>
    </div>
  )
}

export default Like