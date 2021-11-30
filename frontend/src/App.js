import './App.css';
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login/login';
import Register from './components/forms/register';
import Dashboard from './components/dashboard/dashboard';
import AddFAndFForm from './components/forms/addfriendsandfamily';
import './App.css'
import UploadPhotoWidget from './components/uploads';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/AddFamily" element={<AddFAndFForm />} />
          <Route path="/upload" element={<UploadPhotoWidget />} />
        </Routes>
      </BrowserRouter>  
  );
}

export default App;
