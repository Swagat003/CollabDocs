import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx';
import './index.css';
import 'react-toastify/ReactToastify.css';

import PrivateRoute from './PrivateRoute.jsx';
import PublicRoute from './PublicRoute.jsx';

import Home from './components/Home.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import Dashboard from './components/Dashboard.jsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <PublicRoute element={<Home />} />
      },
      {
        path: '/dashboard',
        element: <PrivateRoute element={<Dashboard />} />
      },
      {
        path: '/login',
        element: <PublicRoute element={<Login />} />
      },
      {
        path: '/signup',
        element: <PublicRoute element={<Signup />} />
      }
    ]
  }
])



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
