/**
 * Toggle the Etsy shop vacation mode.
 *
 * Etsy v3: PATCH /v3/application/shops/{shop_id} accepts is_vacation (bool) +
 * vacation_message + vacation_autoreply.
 *
 * Run: node tools/etsy-publish/toggle-vacation.js off   # take off vacation
 *      node tools/etsy-publish/toggle-vacation.js on    # put on vacation
 */
import { readFileSync } from 'fs';

const CONFIG_PATH = 'C:\\Users\\karee\\AppData\\Roaming\\Claude\\claude_desktop_config.json';
const cfg = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
const { ETSY_API_KEY, ETSY_SHARED_SECRET, ETSY_ACCESS_TOKEN } = cfg.mcpServers.etsy.env;
const SHOP_ID = 65897101;

const arg = (process.argv[2] || '').toLowerCase();
if (arg !== 'on' && arg !== 'off') {
  console.error('Usage: node toggle-vacation.js <on|off>');
  process.exit(2);
}
const isVacation = arg === 'on';

const body = new URLSearchParams({ is_vacation: String(isVacation) });
const url = `https://openapi.etsy.com/v3/application/shops/${SHOP_ID}`;

console.log(`→ PATCH ${url}`);
console.log(`→ is_vacation = ${isVacation}`);

const res = await fetch(url, {
  method: 'PUT',
  headers: {
    'x-api-key': `${ETSY_API_KEY}:${ETSY_SHARED_SECRET}`,
    'Authorization': `Bearer ${ETSY_ACCESS_TOKEN}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: body.toString(),
});
const text = await res.text();
if (!res.ok) {
  console.error(`✗ Etsy ${res.status}: ${text}`);
  process.exit(1);
}
const data = JSON.parse(text);
console.log(`\n✓ Shop ${SHOP_ID} updated`);
console.log(`  is_vacation: ${data.is_vacation}`);
console.log(`  shop_name:   ${data.shop_name}`);
if (!isVacation) {
  console.log('\n  All currently-active listings are now buyable. Drafts remain in draft state.');
}
