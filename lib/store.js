import { put, list } from '@vercel/blob';

export async function readJSON(key, fallback) {
  const { blobs } = await list({ prefix: key, limit: 1 });
  if (!blobs.length) return fallback;
  const r = await fetch(blobs[0].url + '?t=' + Date.now(), { cache: 'no-store' });
  return await r.json();
}

export async function writeJSON(key, data) {
  await put(key, JSON.stringify(data), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    cacheControlMaxAge: 60,
  });
}

export function makeHandler({ key, field, empty, valid }) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    try {
      if (req.method === 'GET') {
        const data = await readJSON(key, empty);
        return res.status(200).json({ [field]: valid(data) ? data : empty });
      }
      if (req.method === 'PUT') {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        if (!valid(body)) return res.status(400).json({ error: 'bad body' });
        await writeJSON(key, body);
        return res.status(200).json({ ok: true });
      }
      res.setHeader('Allow', 'GET, PUT');
      return res.status(405).end();
    } catch (e) {
      return res.status(500).json({ error: String((e && e.message) || e) });
    }
  };
}
