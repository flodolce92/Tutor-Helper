import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Home } from './pages/Home';
import { Callback } from './pages/Callback';
import { SearchPage } from './pages/SearchPage';
import { FilterPage } from './pages/FilterPage';
import { OnlinePage } from './pages/OnlinePage';
import { EventsPage } from './pages/EventsPage';

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<style>
					{`
						.nav-link {
							color: #cccccc;
							text-decoration: none;
							padding: 10px 20px;
							border-radius: 8px;
							transition: all 0.2s;
							font-weight: 500;
							font-size: 15px;
						}
						.nav-link:hover {
							color: #00babc;
							background-color: rgba(0, 186, 188, 0.1);
							transform: translateY(-2px);
						}
						.nav-link.active {
							color: #00babc;
							background-color: rgba(0, 186, 188, 0.15);
						}
					`}
				</style>
				<nav
					style={{
						padding: '16px 20px',
						backgroundColor: '#1e1e1e',
						borderBottom: '2px solid #333333',
						display: 'flex',
						gap: '8px',
						justifyContent: 'center',
						alignItems: 'center',
						flexWrap: 'wrap',
						boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
					}}>
					<Link to="/" className="nav-link">
						🏠 Home
					</Link>
					<Link to="/search" className="nav-link">
						🔍 Search
					</Link>
					<Link to="/filter" className="nav-link">
						🏊 Piscine
					</Link>
					<Link to="/online" className="nav-link">
						🟢 Online
					</Link>
					<Link to="/events" className="nav-link">
						📅 Events
					</Link>
				</nav>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/callback" element={<Callback />} />
					<Route path="/search" element={<SearchPage />} />
					<Route path="/filter" element={<FilterPage />} />
					<Route path="/online" element={<OnlinePage />} />
					<Route path="/events" element={<EventsPage />} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
