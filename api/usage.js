import { makeHandler } from '../lib/store.js';

// { "<idPrenda>": [vecesUsada, ultimaVezTimestamp] }
const valid = (d) =>
  d && typeof d === 'object' && !Array.isArray(d) && Object.keys(d).length <= 1000 &&
  Object.values(d).every((v) => Array.isArray(v) && v.length === 2 && v.every(Number.isFinite));

export default makeHandler({ key: 'usage.json', field: 'usage', empty: {}, valid });
