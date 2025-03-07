import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";


const UserLogout = () => {
  const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
      const token = localStorage.getItem('token');
      axios.get(`${BASE_URL}/users/logout`, { headers: { Authorization: `Bearer ${token}` } })
    .then(response => {
        if(response.status === 200){
            localStorage.removeItem('token');
            localStorage.removeItem("role");
            navigate('/user/login');

        }
       
    })
    .catch((error) => {
      console.error('Logout failed:', error);
      navigate('/user/home'); 
    })
    .finally(() => {
      setLoading(false);
    });
    
    }, [navigate])
    
  return (
    <div>
       
    </div>
  )
}

export default UserLogout
