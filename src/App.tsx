import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Home } from './pages/Home';
import { Callback } from './pages/Callback';
import { SearchPage } from './pages/SearchPage';
import { FilterPage } from './pages/FilterPage';
import { OnlinePage } from './pages/OnlinePage';

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<nav
					style={{
						padding: '10px',
						backgroundColor: '#1e1e1e',
						borderBottom: '1px solid #333333',
						display: 'flex',
						gap: '20px',
						justifyContent: 'center',
					}}>
					<Link
						to="/search"
						style={{ color: '#00babc', textDecoration: 'none' }}>
						Search
					</Link>
					<Link
						to="/filter"
						style={{ color: '#00babc', textDecoration: 'none' }}>
						Filter by Piscine
					</Link>
					<Link
						to="/online"
						style={{ color: '#00babc', textDecoration: 'none' }}>
						Online Students
					</Link>
				</nav>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/callback" element={<Callback />} />
					<Route path="/search" element={<SearchPage />} />
					<Route path="/filter" element={<FilterPage />} />
					<Route path="/online" element={<OnlinePage />} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
