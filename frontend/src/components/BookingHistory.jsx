import React, { useEffect, useContext, useState, useMemo } from "react";
import "./BookingHistory.css";
import { BookingContext } from "../context/BookingContext";
import Navbar from "./Navbar";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const BookingHistory = () => {
    const { history, setHistory, fmail } = useContext(BookingContext);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [sortConfig, setSortConfig] = useState({ key: "date", order: "asc" });

    useEffect(() => {
        if (!fmail) {
            console.error("fmail is undefined!");
            return;
        }
        console.log("mail id =="+fmail)
        const fetchBookings = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/bookings/history", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fmail }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setHistory(data.reverse());
            } catch (error) {
                console.error("Failed to fetch bookings:", error);
            }
        };

        fetchBookings();
    }, [setHistory, fmail]);

    // Filter and Sort Data
    const filteredHistory = useMemo(() => {
        if (!history) return [];

        return history
            .filter((booking) =>
                ["name", "source", "destination"].some((key) =>
                    booking[key]?.toLowerCase().includes(searchQuery.toLowerCase())
                )
            )
            .sort((a, b) => {
                const { key, order } = sortConfig;
                return order === "asc"
                    ? a[key]?.localeCompare(b[key])
                    : b[key]?.localeCompare(a[key]);
            });
    }, [history, searchQuery, sortConfig]);

    // Paginated Items
    const paginatedHistory = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredHistory.slice(start, start + itemsPerPage);
    }, [filteredHistory, currentPage, itemsPerPage]);

    // Handle Sorting
    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            order: prev.key === key && prev.order === "asc" ? "desc" : "asc",
        }));
    };

    // Export to PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Booking History", 10, 10);
        doc.autoTable({
            head: [["S.no", "User Name", "Date & Time", "Source", "Destination", "Reason", "Status"]],
            body: filteredHistory.map((booking, index) => [
                index + 1, booking.name, `${booking.date} ${booking.time}`, booking.source, booking.destination, booking.reason, booking.status,
            ]),
        });
        doc.save("BookingHistory.pdf");
    };

    // Export to Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredHistory);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "BookingHistory");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
        saveAs(data, "BookingHistory.xlsx");
    };

    return (
        <div className="book-container">
            <Navbar />
            <div className="booking-container">
                <h2 className="title">Booking History</h2>

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search by name, source, or destination"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />

                {/* Export Buttons */}
                <div className="export-buttons">
                    <button onClick={exportToPDF}>Download PDF</button>
                    <button onClick={exportToExcel}>Download Excel</button>
                </div>

                {/* Booking Table */}
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort("date")}>S.no</th>
                            <th onClick={() => handleSort("name")}>User Name</th>
                            <th onClick={() => handleSort("date")}>Date & Time</th>
                            <th onClick={() => handleSort("source")}>Source</th>
                            <th onClick={() => handleSort("destination")}>Destination</th>
                            <th>Reason</th>
                            <th onClick={() => handleSort("status")}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedHistory.length > 0 ? (
                            paginatedHistory.map((booking, index) => (
                                <tr key={booking._id}>
                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td>{booking.name}<br />({booking.staffId})</td>
                                    <td>{booking.date} <br />{booking.time}</td>
                                    <td>{booking.source}</td>
                                    <td>{booking.destination}</td>
                                    <td>{booking.reason}</td>
                                    <td>
                                        <span className={`status ${booking.status.toLowerCase()}`}>{booking.status}</span>
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

                {/* Pagination Controls */}
                <div className="pagination">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                    <span>Page {currentPage}</span>
                    <button disabled={currentPage * itemsPerPage >= filteredHistory.length} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default BookingHistory;
