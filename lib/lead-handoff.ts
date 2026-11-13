// Carries a seller's details between pages without putting them in the URL (F-004).
//
// Meta's pixel script sends the full page URL to Meta's gateway, so an address, name, email or phone in a
// query string goes to Meta with every event. Pages hand these values over in sessionStorage instead: it
// stays in this browser tab and is gone when the tab closes.
//
// Old links and ads may still arrive with ?address=&n=&e=&p=. STRIP_PII_SCRIPT runs in the page head,
// before Meta's script or the app starts, moves those values into the same storage and removes them from
// the address bar, together with any other parameter that names a person or an address and any fragment
// that carries a value. It keeps the rest (UTMs, interested_in_agent).
//
// Each hand-off replaces what was stored, each reader clears it, and an unread hand-off expires after
// PREFILL_TTL_MS, so a second person using the same tab never sees the first person's details (audit A1-01).
// Besides the named keys, any parameter whose value looks like an email or a US phone number (10 or 11 digits
// and phone punctuation only) is removed, and so is a fragment that carries a value, an email or a phone
// number (A1-04, cycle 2). Ad and click ids (fbclid, utm_content with a 15-digit ad id) do not match.

export const PREFILL_KEY = 'ss_lead_prefill';
export const PREFILL_TTL_MS = 30 * 60 * 1000;

export interface Prefill {
  address?: string;
  name?: string;
  email?: string;
  phone?: string;
}

/** Query parameter, and the Prefill field it fills. */
export const PII_QUERY_KEYS: Record<string, keyof Prefill> = { address: 'address', n: 'name', e: 'email', p: 'phone' };
/** Removed from URLs too, but never used to prefill (audit A1-04). Keys match without regard to case. */
export const PII_DROP_KEYS = [
  'name', 'fullname', 'full_name', 'first_name', 'firstname', 'last_name', 'lastname', 'owner_name', 'email',
  'phone', 'tel', 'mobile', 'cell', 'street', 'street_address', 'property_address', 'address1', 'address2',
  'unit', 'zip',
];

export function readPrefill(): Prefill {
  try {
    const raw = window.sessionStorage.getItem(PREFILL_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== 'object') return {};
    const at = (parsed as Record<string, unknown>).at;
    if (typeof at !== 'number' || Date.now() - at > PREFILL_TTL_MS || at > Date.now() + 60_000) return {};
    const out: Prefill = {};
    for (const field of Object.values(PII_QUERY_KEYS)) {
      const v = (parsed as Record<string, unknown>)[field];
      if (typeof v === 'string' && v) out[field] = v;
    }
    return out;
  } catch {
    return {};
  }
}

/** Replaces whatever was stored: values from an earlier visitor never carry over. */
export function savePrefill(values: Prefill): void {
  try {
    window.sessionStorage.setItem(PREFILL_KEY, JSON.stringify({ ...values, at: Date.now() }));
  } catch {
    // Storage blocked: the next page simply asks again.
  }
}

/** Reads and clears in one step, for the page that uses the values. */
export function takePrefill(): Prefill {
  const values = readPrefill();
  clearPrefill();
  return values;
}

export function clearPrefill(): void {
  try {
    window.sessionStorage.removeItem(PREFILL_KEY);
  } catch {
    // Nothing stored.
  }
}

// Plain ES5 on purpose: it runs as an inline head script, before any bundle. It must never throw.
export const STRIP_PII_SCRIPT = `(function(){
window.__ssStripPii=function(){try{
var u=new URL(window.location.href),keys=${JSON.stringify(PII_QUERY_KEYS)},drop=${JSON.stringify(PII_DROP_KEYS)},
found={},prefill=false,hit=false,k,lk,v,i,names=[];
var looksPii=function(s){var d=s.replace(/\\D/g,'').length;return /[^\\s@]+@[^\\s@]+\\.[^\\s@]+/.test(s)||(/^[\\d\\s\\-+().]+$/.test(s)&&(d===10||d===11));};
u.searchParams.forEach(function(val,key){names.push(key);});
for(i=0;i<names.length;i++){k=names[i];lk=k.toLowerCase();v=u.searchParams.get(k)||'';
if(keys.hasOwnProperty(lk)){if(v){found[keys[lk]]=v;prefill=true;}u.searchParams.delete(k);hit=true;}
else if(drop.indexOf(lk)>=0||looksPii(v)){u.searchParams.delete(k);hit=true;}}
var hash=u.hash,dh=hash;try{dh=decodeURIComponent(hash);}catch(e){}
if(hash&&(hash.indexOf('=')>=0||looksPii(dh))){hash='';hit=true;}
if(!hit)return;
if(prefill){found.at=Date.now();try{window.sessionStorage.setItem(${JSON.stringify(PREFILL_KEY)},JSON.stringify(found));}catch(e){}}
window.history.replaceState(window.history.state,'',u.pathname+u.search+hash);
}catch(e){}};
window.__ssStripPii();
})();`;
