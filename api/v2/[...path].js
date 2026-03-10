export default async function handler(req, res) {
	const urlWithoutPrefix = req.url.replace(/^\/api\/v2/, '');
	const [rawPath, rawQuery] = urlWithoutPrefix.split('?');
	const cleanPath = rawPath.replace(/^\//, '');

	const queryParams = new URLSearchParams(rawQuery ?? '');

	const qs = queryParams.toString();
	const targetUrl = `https://api.intra.42.fr/v2/${cleanPath}${qs ? `?${qs}` : ''}`;

	const headers = { 'Content-Type': 'application/json' };
	const authHeader = req.headers['authorization'];
	if (authHeader) headers['Authorization'] = authHeader;

	console.log(`Proxying: ${req.method} ${targetUrl}`);

	try {
		const response = await fetch(targetUrl, {
			method: req.method ?? 'GET',
			headers,
			body:
				req.method !== 'GET' && req.method !== 'HEAD'
					? JSON.stringify(req.body)
					: undefined,
		});

		console.log(`Response status: ${response.status}`);

		const text = await response.text();

		let data;
		try {
			data = JSON.parse(text);
		} catch {
			console.error('Non-JSON response from 42 API:', text.slice(0, 200));
			return res.status(response.status).json({
				error: 'Unexpected response from 42 API',
				raw: text.slice(0, 200),
			});
		}

		// Add caching for pool user queries (24 hours)
		if (
			response.status === 200 &&
			cleanPath.includes('/users') &&
			queryParams.has('filter[pool_month]') &&
			queryParams.has('filter[pool_year]')
		) {
			res.setHeader(
				'Cache-Control',
				'public, s-maxage=86400, stale-while-revalidate=43200',
			);
		}

		return res.status(response.status).json(data);
	} catch (error) {
		console.error('API proxy error:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
}
