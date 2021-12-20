import './App.css';
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Register from './components/forms/register';
import Dashboard from './components/dashboard/dashboard';
import ViewFamily from './components/vewFamily'
import './App.css'


function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/family" element={<ViewFamily />} />
        </Routes>
      </BrowserRouter>  
  );
}

export default App;
