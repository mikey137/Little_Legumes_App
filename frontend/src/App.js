import './App.css';
import React, { useState} from 'react'
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

import './App.css'


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  return (
    <ThemeProvider theme = { colorTheme }>
      <BrowserRouter>
        <NewNavbar isLoggedIn = {isLoggedIn} setIsLoggedIn={ setIsLoggedIn } />
        <Routes>
          <Route 
            path="/" 
            element={<Landing />} 
          />
          <Route 
            path="/login"   
            element={<Login isLoggedIn = {isLoggedIn} setIsLoggedIn={ setIsLoggedIn } />} 
          />
          <Route 
            path="/Register" 
            element={<Register isLoggedIn = {isLoggedIn} setIsLoggedIn={ setIsLoggedIn }/>} 
          />
          <Route 
            path="/demo" 
            element={<DemoCalendar />} 
          />
          <Route 
            path="/calendar"  
            element={isLoggedIn ? <Calendar /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/family" 
            element={isLoggedIn ? <ViewFamily /> : <Navigate to="/login" />} />
        </Routes>
      </BrowserRouter> 
    </ThemeProvider> 
  );
}

export default App;
