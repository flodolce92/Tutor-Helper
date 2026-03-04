export default async function handler(req, res) {
	// Extract path from URL directly, ignoring Vercel's query injection
	const urlWithoutPrefix = req.url.replace(/^\/api\/v2/, '');
	const [rawPath, rawQuery] = urlWithoutPrefix.split('?');
	const cleanPath = rawPath.replace(/^\//, '');

	// Parse original query string, excluding Vercel's injected ...path param
	const queryParams = new URLSearchParams(rawQuery ?? '');
	queryParams.delete('...path');
	queryParams.delete('path');

	const qs = queryParams.toString();
	const targetUrl = `https://api.intra.42.fr/v2/${cleanPath}${qs ? `?${qs}` : ''}`;

	const headers = { 'Content-Type': 'application/json' };
	const authHeader = req.headers['authorization'];
	if (authHeader) headers['Authorization'] = authHeader;

	console.log(`Proxying: ${req.method} ${targetUrl}`);
	console.log('Auth header present:', !!authHeader);

	try {
		const response = await fetch(targetUrl, {
			method: req.method ?? 'GET',
			headers,
			body: req.method !== 'GET' && req.method !== 'HEAD'
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

		return res.status(response.status).json(data);
	} catch (error) {
		console.error('API proxy error:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
}
