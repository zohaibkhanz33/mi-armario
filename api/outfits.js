import { makeHandler } from '../lib/store.js';

export default makeHandler({
  key: 'outfits.json',
  field: 'outfits',
  empty: [],
  valid: (d) => Array.isArray(d) && d.length <= 5000,
});
