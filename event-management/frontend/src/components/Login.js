import React, { useState } from 'react';
import axios from 'axios';

function Login({ setAuth, setUserId }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submitLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/users/login', form);
      setAuth(true);
      setUserId(res.data.userId);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);
      window.location.href = "/events";
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={submitLogin}>
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit" disabled={loading}>Login</button>
        {loading && <div>Logging in...</div>}
      </form>
    </div>
  );
}

export default Login;
