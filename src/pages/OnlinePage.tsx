import { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';
import type { LocationUser, UserSearch } from '../types/user';
import { OnlineUserCard } from '../components/OnlineUserCard';
import { UserModal } from '../components/UserModal';
import John from '/john.gif';

export const OnlinePage = () => {
	const [locations, setLocations] = useState<LocationUser[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedUser, setSelectedUser] = useState<UserSearch | null>(null);
	const [selectedRow, setSelectedRow] = useState<number | null>(null);
	const [selectedStation, setSelectedStation] = useState<number | null>(null);

	const handleUserClick = (user: any) => {
		setSelectedUser(user as UserSearch);
	};

	const parseHost = (host: string): { row: number; station: number } | null => {
		const match = host.match(/r(\d+)p(\d+)/);
		if (match) {
			return {
				row: parseInt(match[1], 10),
				station: parseInt(match[2], 10),
			};
		}
		return null;
	};

	// Get all occupied rows
	const getOccupiedRows = (): Set<number> => {
		const rows = new Set<number>();
		locations.forEach((loc) => {
			const parsed = parseHost(loc.host);
			if (parsed) {
				rows.add(parsed.row);
			}
		});
		return rows;
	};

	// Get all occupied stations
	const getOccupiedStations = (): Set<number> => {
		const stations = new Set<number>();
		locations.forEach((loc) => {
			const parsed = parseHost(loc.host);
			if (parsed) {
				stations.add(parsed.station);
			}
		});
		return stations;
	};

	// Get available stations for a specific row
	const getStationsForRow = (row: number): Set<number> => {
		const stations = new Set<number>();
		locations.forEach((loc) => {
			const parsed = parseHost(loc.host);
			if (parsed && parsed.row === row) {
				stations.add(parsed.station);
			}
		});
		return stations;
	};

	// Get available rows for a specific station
	const getRowsForStation = (station: number): Set<number> => {
		const rows = new Set<number>();
		locations.forEach((loc) => {
			const parsed = parseHost(loc.host);
			if (parsed && parsed.station === station) {
				rows.add(parsed.row);
			}
		});
		return rows;
	};

	// Filter locations based on selected filters
	const filteredLocations = locations.filter((loc) => {
		const parsed = parseHost(loc.host);
		if (!parsed) return true;

		if (selectedRow !== null && parsed.row !== selectedRow) {
			return false;
		}

		if (selectedStation !== null && parsed.station !== selectedStation) {
			return false;
		}

		return true;
	});

	const handleRowClick = (row: number, isEnabled: boolean) => {
		if (!isEnabled) return;
		if (selectedRow === row) {
			setSelectedRow(null);
		} else {
			setSelectedRow(row);
		}
	};

	const handleStationClick = (station: number, isEnabled: boolean) => {
		if (!isEnabled) return;
		if (selectedStation === station) {
			setSelectedStation(null);
		} else {
			setSelectedStation(station);
		}
	};

	useEffect(() => {
		const fetchLocations = async () => {
			try {
				const locs = await apiService.getLocations();
				locs.sort((a, b) =>
					a.host.localeCompare(b.host, undefined, { numeric: true }),
				);
				setLocations(locs);
			} catch (error) {
				console.error('Failed to fetch locations:', error);
				alert('Failed to load online students.');
			} finally {
				setLoading(false);
			}
		};

		fetchLocations();
	}, []);

	if (loading) {
		return (
			<div style={{ textAlign: 'center', marginTop: '100px' }}>
				<h2 style={{ color: '#ffffff' }}>Loading...</h2>
			</div>
		);
	}

	if (locations.length === 0) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '70vh',
				}}>
				<img src={John} alt="No students online" />
			</div>
		);
	}

	const occupiedRows = getOccupiedRows();
	const occupiedStations = getOccupiedStations();

	// Enable only the right buttons based on current selection
	const enabledRows =
		selectedStation !== null
			? getRowsForStation(selectedStation)
			: occupiedRows;

	const enabledStations =
		selectedRow !== null ? getStationsForRow(selectedRow) : occupiedStations;

	// All possible rows and stations
	const allRows = Array.from({ length: 12 }, (_, i) => i + 1);
	const allStations = Array.from({ length: 8 }, (_, i) => i + 1);

	return (
		<div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
			<style>
				{`
					.online-grid {
						display: grid;
						grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
						gap: 20px;
					}
					@media (max-width: 768px) {
						.online-grid {
							grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
						}
					}
					.filter-button {
						padding: 8px 12px;
						margin: 4px;
						border: 2px solid #555;
						background-color: #2a2a2a;
						color: #cccccc;
						border-radius: 6px;
						cursor: pointer;
						font-size: 14px;
						transition: all 0.2s ease;
					}
					.filter-button:hover:not(:disabled) {
						background-color: #3a3a3a;
						border-color: #777;
					}
					.filter-button.active {
						background-color: #007acc;
						border-color: #007acc;
						color: #ffffff;
					}
					.filter-button:disabled {
						opacity: 0.3;
						cursor: not-allowed;
					}
					.filter-section {
						display: flex;
						gap: 12px;
						align-items: center;
						margin-bottom: 20px;
					}
					.filter-label {
						color: #ffffff;
						font-weight: bold;
						margin-top: 8px;
					}
					.filter-buttons-grid {
						display: flex;
						flex-wrap: wrap;
					}
				`}
			</style>

			{/* Row filters */}
			<div className="filter-section">
				<span className="filter-label">R:</span>
				<div className="filter-buttons-grid">
					{allRows.map((row) => {
						const isEnabled = enabledRows.has(row);
						return (
							<button
								key={row}
								className={`filter-button ${selectedRow === row ? 'active' : ''}`}
								disabled={!isEnabled}
								onClick={() => handleRowClick(row, isEnabled)}>
								{row}
							</button>
						);
					})}
				</div>
			</div>

			{/* Station filters */}
			<div className="filter-section">
				<span className="filter-label">P:</span>
				<div className="filter-buttons-grid stations">
					{allStations.map((station) => {
						const isEnabled = enabledStations.has(station);
						return (
							<button
								key={station}
								className={`filter-button ${selectedStation === station ? 'active' : ''}`}
								disabled={!isEnabled}
								onClick={() => handleStationClick(station, isEnabled)}>
								{station}
							</button>
						);
					})}
				</div>
			</div>

			<p style={{ marginBottom: '15px', color: '#cccccc' }}>
				Found {locations.length} student{locations.length !== 1 ? 's' : ''}{' '}
				online
				{filteredLocations.length !== locations.length && (
					<span> (showing {filteredLocations.length} filtered)</span>
				)}
			</p>

			<div className="online-grid">
				{filteredLocations.map((loc) => (
					<OnlineUserCard
						key={loc.id}
						location={loc}
						onClick={() => handleUserClick(loc.user)}
					/>
				))}
			</div>
			<UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
		</div>
	);
};
