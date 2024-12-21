import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import './css/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const [Name, setName] = useState("");

  useEffect(() => {
    setName(JSON.parse(localStorage.getItem('user')));
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  return (
    <>
      <div id='navbar'>
        <Link to="/" id='icon-name'>
          <img src="./document.png" alt="logo" />
          <h1>Collab Docs</h1>
        </Link>
        <div id='menu'>
          {localStorage.getItem('token') ? (
            <>
              <div id='profile-name'>Hi! {Name}👋</div>
              <button id='logedout' onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink className={(e) => e.isActive ? "active-link" : ""} to='/login'>Login</NavLink>
              <NavLink className={(e) => e.isActive ? "active-link" : ""} to='/signup'>Signup</NavLink>
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Navbar;