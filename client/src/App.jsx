import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Homes from './pages/Homes';
import Profiles from './pages/Profiles';
import Appointment from './pages/Appointment';
import Payment from './pages/Payment';
import Success from './pages/Success';
import Prescription from './pages/Prescription';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/homes" element={<Homes />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/payment" element={<Payment />} /> 
        <Route path="/success" element={<Success />} />
        <Route path="/prescription" element={<Prescription />} /> 
       
       
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
