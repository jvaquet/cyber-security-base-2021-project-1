import React, { useState } from 'react'
import axios from 'axios'
import {baseUrl} from '../App'


const Message = ({ users, token }) => {
  const [user, setUser] = useState('')
  const [message, setMessage] = useState('')

  const handleSubimt = (e) => {
    e.preventDefault()
    if(!user)
      return
    const headers = {'Authorization': `bearer ${token}`}
    axios.post(baseUrl + 'messages', { to: user, message: message }, { headers })
  }

  return (
    <div>
      <h3>Send anyone messages, even yourself!</h3>
      <p>You can even add images, just use html ;-)</p>
      <form onSubmit={handleSubimt}>
        <div>
          message:
          <textarea value={message} onChange={e => setMessage(e.target.value)} name="message" rows="4" cols="50"></textarea>
        </div>
        <div>
          user:
          <select name='user' id='user' value={user} onChange={e => setUser(e.target.value)}>
            {users.map(user => <option key={user} value={user}>{user}</option>)}
          </select>
        </div>
        <button>send message</button>
      </form>
    </div>
  )
}

export default Message