import React from 'react'
import { Link } from 'react-router-dom'
import './css/Home.css'

function Home() {
  return (
    <div className='home-container'>
      <h1>Welcome to "<span><img src="./document.png" alt="logo" />Collab Docs</span>"</h1>
      <p>
        Collab Docs is a platform for creating and sharing documents with others.
        You can create a document, share it with others, and collaborate on it in real-time.
      </p>
      <div className='home-links'>
        <Link to='/login'><button>Login</button></Link>
        <Link to='/signup'><button>Sign up</button></Link>
      </div>
    </div>
  )
}

export default Home
