import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { BsPersonCircle } from "react-icons/bs";
import { FaHistory } from "react-icons/fa";
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="nav">
      <div className="title">
        <h1 onClick={()=>navigate('/book')}>eV-<span>finder</span></h1>
      </div>
      <div className="profile">
        <FaHistory 
          className='img' 
          onClick={() => navigate('/booking-history')} // Use an arrow function to navigate
        />
        <BsPersonCircle className='img' />
      </div>
    </div>
  );
};

export default Navbar;
