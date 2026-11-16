import { put, list } from '@vercel/blob';

const KEY = 'outfits.json';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method === 'GET') {
      const { blobs } = await list({ prefix: KEY, limit: 1 });
      if (!blobs.length) return res.status(200).json({ outfits: [] });
      const r = await fetch(blobs[0].url + '?t=' + Date.now(), { cache: 'no-store' });
      const outfits = await r.json();
      return res.status(200).json({ outfits: Array.isArray(outfits) ? outfits : [] });
    }
    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!Array.isArray(body) || body.length > 5000) return res.status(400).json({ error: 'bad body' });
      await put(KEY, JSON.stringify(body), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
        cacheControlMaxAge: 60,
      });
      return res.status(200).json({ ok: true });
    }
    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).end();
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message || e) });
  }
}
