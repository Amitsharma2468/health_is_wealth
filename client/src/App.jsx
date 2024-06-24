import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/signup';
import Homes from './pages/Homes';
import Profiles from './pages/Profiles';
import Appointment from './pages/Appointment';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<HomePage/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/signup' element={<Signup/>} />
      <Route path='/homes' element={<Homes/>} />
      <Route path='/profiles' element={<Profiles/>} />
      <Route path='/appointment' element={<Appointment/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App;