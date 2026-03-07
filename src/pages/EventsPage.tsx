import { useEffect, useState } from 'react';
import { apiService } from '../services/api.service';
import type { Event } from '../types/event';
import { EventCard } from '../components/EventCard';

export const EventsPage = () => {
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const evs = await apiService.getEvents();
				const filteredEvents = evs.filter((event) => {
					return event.cursus_ids.includes(9);
				});
				setEvents(filteredEvents);
			} catch (error) {
				console.error('Failed to fetch events:', error);
				alert('Failed to load events.');
			} finally {
				setLoading(false);
			}
		};

		fetchEvents();
	}, []);

	if (loading) {
		return (
			<div style={{ textAlign: 'center', marginTop: '100px' }}>
				<h2 style={{ color: '#ffffff' }}>Loading...</h2>
			</div>
		);
	}

	return (
		<div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
			<style>
				{`
					.events-grid {
						display: grid;
						grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
						gap: 20px;
					}
					@media (max-width: 768px) {
						.events-grid {
							grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
						}
					}
				`}
			</style>
			<p style={{ marginBottom: '15px', color: '#cccccc' }}>
				{events.length > 0 ? (
					<>
						Trovati {events.length} event{events.length !== 1 ? 'i' : 'o'}
					</>
				) : (
					'Nessun evento trovato'
				)}
			</p>

			<div className="events-grid">
				{events.map((event) => (
					<EventCard key={event.id} event={event} />
				))}
			</div>
		</div>
	);
};
