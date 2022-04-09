import './App.css';
import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/forms/register';
import Calendar from './components/calendar';
import ViewFamily from './components/viewFamily'
import Landing from './components/landing';
import Login from './components/login';
import DemoCalendar from './components/demo';
import NewNavbar from './components/newNavbar';
import { ThemeProvider } from '@mui/material/styles';
import { colorTheme } from './ThemeContext';
import axios from 'axios'
import { apiConfig } from './Constants';

import './App.css'


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState("")

  let url = apiConfig.url.API_URL

  useEffect(() => {
    checkAuthenticated()
  },[isLoggedIn])

  const checkAuthenticated = async () => {
    let token = localStorage.token
    if(token){
      try {
        const res = await axios(`${url}/verifylogin`, {
          method: "POST",
          headers: { jwt_token: localStorage.token }
        });
        console.log(res)
        const parseRes = await res.data;
        
        parseRes === true ? setIsLoggedIn(true) : setIsLoggedIn(false);
      } catch (err) {
        console.error(err.message);
      }
    }else{
      setIsLoggedIn(false)
    }
  };

  const setLoginStatus = boolean => {
    setIsLoggedIn(boolean)
  }

  return (
    <ThemeProvider theme = { colorTheme }>
      <BrowserRouter>
        <NewNavbar setLoginStatus = { setLoginStatus } isLoggedIn = { isLoggedIn } />
        <Routes>
          <Route 
            path="/" 
            element={<Landing />} 
          />
          <Route 
            path="/login"   
            element=
              {isLoggedIn !== true ? <Login setLoginStatus = { setLoginStatus } /> : <Navigate to = "/calendar" />} 
          />
          <Route 
            path="/Register" 
            element=
              {isLoggedIn !== true ? <Register setLoginStatus = { setLoginStatus }/> : <Navigate to = "/calendar" />} 
          />
          <Route 
            path="/demo" 
            element={<DemoCalendar />} 
          />
          <Route 
            path="/calendar"  
            element={isLoggedIn !== false ? <Calendar /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/family" 
            element={isLoggedIn !== false ? <ViewFamily /> : <Navigate to="/login" />} 
          />
        </Routes>
      </BrowserRouter> 
    </ThemeProvider> 
  );
}

export default App;