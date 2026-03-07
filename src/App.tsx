import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Home } from './pages/Home';
import { Callback } from './pages/Callback';
import { SearchPage } from './pages/SearchPage';
import { FilterPage } from './pages/FilterPage';
import { OnlinePage } from './pages/OnlinePage';
import { EventsPage } from './pages/EventsPage';
import './App.css';

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<nav>
					<Link to="/" className="nav-link">
						🏠<span className="nav-text"> Home</span>
					</Link>
					<Link to="/search" className="nav-link">
						🔍<span className="nav-text"> Search</span>
					</Link>
					<Link to="/filter" className="nav-link">
						🏊<span className="nav-text"> Piscine</span>
					</Link>
					<Link to="/online" className="nav-link">
						🟢<span className="nav-text"> Online</span>
					</Link>
					<Link to="/events" className="nav-link">
						📅<span className="nav-text"> Events</span>
					</Link>
				</nav>
				<div className="content-wrapper">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/callback" element={<Callback />} />
						<Route path="/search" element={<SearchPage />} />
						<Route path="/filter" element={<FilterPage />} />
						<Route path="/online" element={<OnlinePage />} />
						<Route path="/events" element={<EventsPage />} />
					</Routes>
				</div>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
