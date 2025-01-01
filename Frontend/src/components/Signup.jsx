import React from 'react'
import { useState } from 'react'
import './css/Signup.css'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

function Signup() {
  const env = import.meta.env;
  const [Signininfo, setSignininfo] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (Signininfo.password !== Signininfo.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!Signininfo.name || !Signininfo.email || !Signininfo.password || !Signininfo.confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }
    try {
      const url = `${env.VITE_BACKEND_URL}/api/auth/signup`;
      const { confirmPassword, ...signinObject } = Signininfo;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signinObject)
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Signed up successfully');
        setSignininfo({ name: '', email: '', password: '', confirmPassword: '' });
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('An error occurred');
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setSignininfo({
      ...Signininfo,
      [name]: value
    })
  }
  return (
    <div id="signup-container">
      <div id='signup'>
        <h1>Sign up</h1>
        <form onSubmit={handleSignup}>
          <input
            onChange={handleChange}
            value={Signininfo.name}
            type='text' name='name' placeholder='Username' required />
          <input
            onChange={handleChange}
            value={Signininfo.email}
            type='email' name='email' placeholder='Email' required />
          <input
            onChange={handleChange}
            value={Signininfo.password}
            type='password' name='password' placeholder='Password' required />
          <input
            onChange={handleChange}
            value={Signininfo.confirmPassword}
            type='password' name='confirmPassword' placeholder='Confirm Password' required />
          <button type='submit'>Sign up</button>
        </form>
        <p>Already have an account? <Link to='/login'>Login</Link></p>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Signup
