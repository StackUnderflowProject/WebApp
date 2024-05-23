import { useState, useEffect } from "react";
import LoadingScreen from './LoadingScreen';

type Event = {
    location: {
        type: string,
        coordinates: [
            number,
            number
        ]
    },
    _id: string,
    name: string,
    description: string,
    activity: string,
    date: string,
    time: string,
    host: {
        _id: string,
        username: string,
        email: string,
        __v: number,
        image: string
    },
    followers: string[],
    __v: number
};

export default function EventList() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    const getEvents = async () => {
        try {
            const response = await fetch('http://localhost:3000/events/upcoming');
            const data = await response.json();
            if (response.ok) {
              setEvents(data);
            } else {
              console.error('Failed to fetch events');
            }
          } catch (error) {
            console.error('Error fetching events:', error);
          } finally {
              setLoading(false);
          }
    }

    useEffect(() => {
        getEvents();
    }, []);

    // LOADING SCREEN
    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="event-list">
            {events.length === 0 ? (
                <p>No events to display...</p>
            ) : (
                events.map(event => (
                    <div key={event._id} className="event-card">
                        <h3>{event.name}</h3>
                        <p>{event.description}</p>
                        <p>Activity: {event.activity}</p>
                        <p>Date: {event.date}</p>
                        <p>Time: {event.time}</p>
                        <p>Host: {event.host.username}</p>
                        {/* Add more details as needed */}
                    </div>
                ))
            )}
        </div>
    );
    
}