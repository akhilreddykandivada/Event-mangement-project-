import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Import your components
import Register from './components/Register';
import Login from './components/Login';
import Events from './components/Events';
import AddEvent from './components/AddEvent';
import BuyTicket from './components/BuyTicket';
import UserProfile from './components/UserProfile';
import Account from './components/Account';
import TicketDetails from './components/TicketDetails';
import './App.css';

function App() {
  const [auth, setAuth] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      setAuth(true);
    }
  }, []);

  const logout = () => {
    setAuth(false);
    setUserId("");
    localStorage.clear();
  };

  return (
    <BrowserRouter>
      <nav>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/events">Events</Link>
        {auth && (
          <>
            <Link to="/add-event">Add Event</Link>
            <Link to="/account">Account</Link>
            <Link to="/profile">Profile</Link>
            <button style={{ marginLeft: "20px" }} onClick={logout}>Logout</button>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setAuth={setAuth} setUserId={setUserId} />} />
        <Route path="/events" element={<Events auth={auth} userId={userId} />} />
        <Route path="/add-event" element={auth ? <AddEvent /> : <div className="container">Please log in to add events.</div>} />
        <Route path="/buy-ticket/:eventId" element={<BuyTicket userId={userId} />} />
        <Route path="/account" element={<Account userId={userId} />} />
        <Route path="/profile" element={<UserProfile userId={userId} />} />
        <Route path="/ticket/:ticketId" element={<TicketDetails />} />
        {/* Optional: Default route */}
        <Route path="*" element={<Events auth={auth} userId={userId} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
