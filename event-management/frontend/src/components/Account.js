import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Account({ userId }) {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/${userId}`);
        setUser(res.data);
        setForm({ name: res.data.name || '', phone: res.data.phone || '' });
      } catch (err) {
        alert('Failed to fetch user info: ' + err.message);
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(`/api/users/${userId}`, form);
      setUser(res.data);
      setEdit(false);
    } catch (err) {
      alert('Failed to update info: ' + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  };

  if (!userId) return <div className="container">Please login to view account details.</div>;
  if (!user) return <div className="container">Loading account details...</div>;

  return (
    <div className="container">
      <h2>Account Details</h2>
      {!edit ? (
        <>
          <p><b>Name:</b> {user.name || ''}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Phone:</b> {user.phone || ''}</p>
          <button onClick={() => setEdit(true)}>Edit</button>
        </>
      ) : (
        <form onSubmit={handleSave}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
          <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={() => setEdit(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
}
export default Account;
