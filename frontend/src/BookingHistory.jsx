import React, { useContext } from 'react';
import './BookingHistory.css';
import { BookingContext } from './context/BookingContext';
import Navbar from './Navbar';

const BookingHistory = () => {
    const { bookings } = useContext(BookingContext);

    return (
        <>
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
                    {bookings.map((booking, index) => (
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
                    ))}
                </tbody>
            </table>
        </div>
        </div>
        </>
    );
};

export default BookingHistory;
