import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import './css/Login.css'

function Login() {
  const [Logininfo, setLogininfo] = useState({
    email: '',
    password: '',
  })

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target
    setLogininfo({
      ...Logininfo,
      [name]: value
    })
  }
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!Logininfo.email || !Logininfo.password) {
      toast.error('Please fill all fields');
      return;
    }
    try {
      const url = '/api/auth/login';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Logininfo)
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Logged in successfully');
        setLogininfo({ email: '', password: '' });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.name));
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('An error occurred');
    }
  }

  return (
    <div id="login-container">
      <div id='login'>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input
            onChange={handleChange}
            value={Logininfo.email}
            type='email' name='email' placeholder='Email' required />
          <input
            onChange={handleChange}
            value={Logininfo.password}
            type='password' name='password' placeholder='Password' required />
          <button type='submit'>Login</button>
        </form>
        <p>Don't have an account? <Link to='/signup'>Sign up</Link></p>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Login
