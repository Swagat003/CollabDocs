import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import './css/Navbar.css'

function Navbar() {
  return (
    <div id='navbar'>
        <Link to="/" id='icon-name'>
            <img src="./document.png" alt="logo" />
            <h1>Collab Docs</h1>
        </Link>
        <div id='menu'>
            <NavLink className={(e) => {return e.isActive? "active-link": ""}} to='/dashboard'>Dashboard</NavLink>
            <NavLink className={(e) => {return e.isActive? "active-link": ""}} to='/login'>Login</NavLink>
            <NavLink className={(e) => {return e.isActive? "active-link": ""}} to='/signup'>Signup</NavLink>
        </div>
    </div>
  )
}

export default Navbar
