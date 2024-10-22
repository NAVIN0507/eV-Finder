import React, { createContext, useState, useEffect } from 'react';

// Create a context
export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [name, setName] = useState('');
  const [staffId, setStaffId] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [reason, setReason] = useState('');
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setModalOpen] = useState(true);

  const fetchBookings = async () => {
    const response = await fetch('http://localhost:5000/api/bookings');
    const data = await response.json();
    setBookings(data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <BookingContext.Provider
      value={{
        name, setName,
        staffId, setStaffId,
        source, setSource,
        destination, setDestination,
        reason, setReason,
        bookings, setBookings,
        fetchBookings,
        isModalOpen,setModalOpen,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
