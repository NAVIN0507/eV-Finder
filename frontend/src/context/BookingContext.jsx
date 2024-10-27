import React, { createContext, useState, useEffect } from 'react';

// Create a context
export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [name, setName] = useState('');
  const [staffId, setStaffId] = useState('');
  const [source, setSource] = useState('Gate-A');
  const [destination, setDestination] = useState('Gate-A');
  const [reason, setReason] = useState('');
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setModalOpen] = useState(true);
  const [notification, setNotification] = useState({ message: '', visible: false });
  const [fname,setFname]=useState('');
  const [fmail,setFmail]=useState('');
  const [time,setTime]=useState('');
  const [date,setDate] =useState('');
  const [photo,setPhoto] =useState('');
  const [history,setHistory]=useState('');
  
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
        time,setTime,
        date,setDate,
        reason, setReason,
        bookings, setBookings,
        fetchBookings,
        isModalOpen,setModalOpen,
        notification,setNotification,
        fname,setFname,
        fmail,setFmail,
        history,setHistory,
        photo,setPhoto
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
