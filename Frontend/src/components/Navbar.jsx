import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import './css/Navbar.css'

function Navbar() {
  const navigate = useNavigate()
  const [isLogged, setIsLogged] = useState(true)
  const [Name, setName] = useState("Swagat")
  function logout() {
    setIsLogged(false)
    navigate('/')
  }
  return (
    <div id='navbar'>
      <Link to="/" id='icon-name'>
        <img src="./document.png" alt="logo" />
        <h1>Collab Docs</h1>
      </Link>
      <div id='menu'>
        {
          isLogged ? (
            <>
              <NavLink className={(e) => e.isActive ? "active-link" : ""} to='/dashboard'>Dashboard</NavLink>
              <div id='profile-name'>Hi! {Name}👋</div>
              <button id='logedout' onClick={() => logout()}>Logout</button>
            </>
          ) : (
            <>
              <NavLink className={(e) => e.isActive ? "active-link" : ""} to='/login'>Login</NavLink>
              <NavLink className={(e) => e.isActive ? "active-link" : ""} to='/signup'>Signup</NavLink>
            </>
          )
        }
      </div>
    </div>
  )
}

export default Navbar