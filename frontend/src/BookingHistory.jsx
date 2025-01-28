import React, { useEffect, useContext } from 'react';
import './BookingHistory.css';
import { BookingContext } from './context/BookingContext';
import Navbar from './Navbar';

const BookingHistory = () => {
    const { history, setHistory,fmail } = useContext(BookingContext);
    
    useEffect(() => {
        console.log("mail id ==",fmail);
        // Fetch bookings filtered by email from backend
        const fetchBookings = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/bookings/history', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ fmail }) // Send email in request body
                });
                const data = await response.json();
                setHistory(data.reverse());
                console.log(data); // For debugging purposes
            } catch (error) {
                console.error("Failed to fetch bookings:", error);
            }
        };
        
        fetchBookings();
    }, [setHistory, fmail]);

    return (
        <div className='book-container'>
            <Navbar/>
            <div className="booking-container">
                <h2 className="title">Booking History</h2>
                <table>
                    <thead>
                        <tr>
                            <th>S.no</th>
                            <th>User Name</th>
                            <th>Date & Time</th>
                            <th>Source</th>
                            <th>Destination</th>
                            <th>Reason</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history && history.length > 0 ? (
                            history.map((booking, index) => (
                                <tr key={booking._id}>
                                    <td>{index + 1}</td>
                                    <td>{booking.name}<br />({booking.staffId})</td>
                                    <td>{booking.date} <br />{booking.time}</td>
                                    <td>{booking.source}</td>
                                    <td>{booking.destination}</td>
                                    <td>{booking.reason}</td>
                                    <td>
                                        <span className={booking.status.toLowerCase()}>{booking.status}</span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">No bookings found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingHistory;
