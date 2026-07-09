import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Box
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import { useNavigate } from 'react-router-dom';

const eventTypes = [
  { value: '', label: 'All' },
  { value: 'college', label: 'College' },
  { value: 'other', label: 'Other' }
];

function Events({ userId }) {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('upcoming');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`/api/events?status=${status}`);
      setEvents(res.data);
    } catch (err) {
      setEvents([]);
    }
  };

  const handleBuy = (eventId) => {
    if (!userId) {
      alert("Please log in before purchasing tickets!");
    } else {
      navigate(`/buy-ticket/${eventId}`);
    }
  };

  // Search and filter
  const filteredEvents = events.filter(event =>
    event.name?.toLowerCase().includes(filter.toLowerCase()) &&
    (type ? event.eventType === type : true)
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>🗓️ Events</Typography>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          color={status === 'upcoming' ? 'primary' : 'inherit'}
          variant={status === 'upcoming' ? 'contained' : 'outlined'}
          onClick={() => setStatus('upcoming')}
        >
          Upcoming
        </Button>
        <Button
          color={status === 'current' ? 'primary' : 'inherit'}
          variant={status === 'current' ? 'contained' : 'outlined'}
          onClick={() => setStatus('current')}
        >
          Today
        </Button>
        <Button
          color={status === 'completed' ? 'primary' : 'inherit'}
          variant={status === 'completed' ? 'contained' : 'outlined'}
          onClick={() => setStatus('completed')}
        >
          Completed
        </Button>
        <TextField
          label="Search"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <TextField
          select
          label="Type"
          size="small"
          value={type}
          onChange={e => setType(e.target.value)}
          sx={{ width: 120 }}
        >
          {eventTypes.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </TextField>
      </Box>
      <Grid container spacing={3}>
        {filteredEvents.map(event => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <Card
              elevation={6}
              sx={{
                height: '100%',
                bgcolor: event.isCancelled ? "#ffe6e6" : "#fafcff",
                border: event.isCancelled ? "2px solid #ff4d4d" : ""
              }}
            >
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  <EventAvailableIcon sx={{ mr: 1, color: "primary.main" }} />
                  {event.name}
                  {event.isCancelled && (
                    <span style={{ color: '#d00000', fontWeight: 'bold', marginLeft: 10 }}>(Cancelled)</span>
                  )}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  <EventNoteIcon sx={{ mr: 1, fontSize: 18 }} />
                  {event.date}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  <LocationOnIcon sx={{ mr: 1, fontSize: 18 }} />
                  {event.location}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  <LabelOutlinedIcon sx={{ mr: 1, fontSize: 18 }} />
                  {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                </Typography>
                <Typography color="text.secondary">
                  <b>Ticket Cost:</b> {event.cost}
                </Typography>
                <Typography color="text.secondary">
                  <b>Tickets Available:</b> {event.ticketsAvailable}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  color="success"
                  disabled={event.ticketsAvailable < 1 || event.isCancelled}
                  onClick={() => handleBuy(event._id)}
                >
                  {event.isCancelled
                    ? "Cancelled"
                    : event.ticketsAvailable > 0
                    ? "Buy Ticket"
                    : "Sold Out"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {filteredEvents.length === 0 && (
        <Typography variant="body1" align="center" sx={{ mt: 4 }}>
          No events found!
        </Typography>
      )}
    </Box>
  );
}

export default Events;
