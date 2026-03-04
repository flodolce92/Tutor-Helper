export default async function handler(req, res) {
	const rawQuery = req.url.split('?')[1] ?? '';
	const queryParams = new URLSearchParams(rawQuery);
	queryParams.delete('...path');
	queryParams.delete('path');

	const qs = queryParams.toString();
	const targetUrl = `https://api.intra.42.fr/v2/campus/30/users${qs ? `?${qs}` : ''}`;

	const headers = { 'Content-Type': 'application/json' };
	const authHeader = req.headers['authorization'];
	if (authHeader) headers['Authorization'] = authHeader;

	console.log(`Proxying: ${req.method} ${targetUrl}`);

	try {
		const response = await fetch(targetUrl, { method: req.method, headers });
		const text = await response.text();
		try {
			return res.status(response.status).json(JSON.parse(text));
		} catch {
			return res.status(response.status).json({ error: text.slice(0, 200) });
		}
	} catch (error) {
		console.error('Proxy error:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
}
