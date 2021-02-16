import axios from 'axios'
import React, { useEffect, useState } from 'react'
import jwt from 'jwt-decode'
import Login from './components/Login'
import Like from './components/Like'
import Message from './components/Message'
import Password from './components/Password'

export const baseUrl = '/api/'

const App = () => {
  const [token, setToken] = useState('')
  const [likes, setLikes] = useState('')
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    const storageToken = localStorage.getItem('token')
    if(storageToken)
      setToken(storageToken)
  }, [])

  useEffect(() => {
    if(!token)
      return

    const headers = {'Authorization': `bearer ${token}`}

    axios.get(baseUrl + 'likes', { headers })
      .then(res => {
        setLikes(res.data.likes)
      })
    const user = jwt(token)
    axios.get(baseUrl + 'messages/' + user.username , { headers })
      .then(res => {
        setMessages(res.data)
      })
    
    axios.get(baseUrl + 'users', { headers })
      .then(res => {
        setUsers(res.data)
      })
  }, [token])

  const logout = () => {
    setToken('')
    localStorage.removeItem('token')
  }

  const toMessageWithMarkup = (msg, idx) => {
    return <div key={idx}> <span dangerouslySetInnerHTML={{__html: msg.msg}}></span> by {msg.from_user}</div>
    /* 
    This method includes HTML markup such as <b>bold text</b>, however it also opens the door for XXS.
    The fixed solution:
       
    return <div key={idx}> {msg.msg} by {msg.from_user}</div>
    */
  }

  let content
  if(!token) {
    content = <Login setToken={setToken} />
  } else {
    content = (
      <div>
        <h1>The best social network!!!</h1>
        <p>Logged in as {} 
          <button onClick={logout}>
            logout
          </button>
        </p>
        <p>You have {likes} likes!</p>
        <h3>Your Messages:</h3>
        <div>
          {messages.map(toMessageWithMarkup)}
        </div>
        <Like users={users} token={token}/>
        <Message users={users} token={token}/>
        <Password token={token} />
      </div>
    )
  }

  return (
    <div className="App">
      {content}
    </div>
  );
}

//<span dangerouslySetInnerHTML={{__html: inject}}></span>

export default App;
