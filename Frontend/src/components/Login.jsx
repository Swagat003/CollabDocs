import React from 'react'
import { Link } from 'react-router-dom'
import './css/Login.css'

function Login() {
  return (
    <div id="login-container">
      <div id='login'>
        <h1>Login</h1>
        <form>
          <input type='email' placeholder='Email' required />
          <input type='password' placeholder='Password' required />
          <button>Login</button>
        </form>
        <p>Don't have an account? <Link to='/signup'>Sign up</Link></p>
      </div>
    </div>
  )
}

export default Login
