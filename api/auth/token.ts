import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { code } = req.body;

	if (!code) {
		return res.status(400).json({ error: 'Missing code' });
	}

	try {
		const response = await fetch('https://api.intra.42.fr/oauth/token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				grant_type: 'authorization_code',
				client_id: process.env.VITE_42_CLIENT_ID,
				client_secret: process.env.VITE_42_CLIENT_SECRET,
				code,
				redirect_uri: process.env.VITE_42_REDIRECT_URI,
			}),
		});

		if (!response.ok) {
			const error = await response.text();
			return res.status(response.status).json({ error });
		}

		const data = await response.json();
		return res.status(200).json(data);
	} catch (error) {
		console.error('Token exchange error:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
}
