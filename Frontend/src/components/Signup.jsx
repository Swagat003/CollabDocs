import React from 'react'
import './css/Signup.css'
import { Link } from 'react-router-dom'

function Signup() {
  return (
    <div id="signup-container">
      <div id='signup'>
        <h1>Sign up</h1>
        <form>
          <input type='text' placeholder='Username' required />
          <input type='email' placeholder='Email' required/>
          <input type='password' placeholder='Password' required/>
          <input type='password' placeholder='Confirm Password' required/>
          <button>Sign up</button>
        </form>
        <p>Already have an account? <Link to='/login'>Login</Link></p>
      </div>
    </div>
  )
}

export default Signup
