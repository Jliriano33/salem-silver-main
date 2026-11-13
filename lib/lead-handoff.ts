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
// Each hand-off replaces what was stored, and each reader clears it, so a second person using the same tab
// never sees the first person's details (audit A1-01).

export const PREFILL_KEY = 'ss_lead_prefill';

export interface Prefill {
  address?: string;
  name?: string;
  email?: string;
  phone?: string;
}

/** Query parameter, and the Prefill field it fills. */
export const PII_QUERY_KEYS: Record<string, keyof Prefill> = { address: 'address', n: 'name', e: 'email', p: 'phone' };
/** Removed from URLs too, but never used to prefill (audit A1-04). Matched without regard to case. */
export const PII_DROP_KEYS = [
  'name', 'fullname', 'full_name', 'first_name', 'firstname', 'last_name', 'lastname', 'email', 'phone',
  'tel', 'street', 'unit', 'zip',
];

export function readPrefill(): Prefill {
  try {
    const raw = window.sessionStorage.getItem(PREFILL_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== 'object') return {};
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
    window.sessionStorage.setItem(PREFILL_KEY, JSON.stringify(values));
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
found={},prefill=false,hit=false,k,i,names=[];
u.searchParams.forEach(function(v,key){names.push(key);});
for(i=0;i<names.length;i++){k=names[i];
if(keys.hasOwnProperty(k)){var v=u.searchParams.get(k);if(v){found[keys[k]]=v;prefill=true;}u.searchParams.delete(k);hit=true;}
else if(drop.indexOf(k.toLowerCase())>=0){u.searchParams.delete(k);hit=true;}}
var hash=u.hash;if(hash&&hash.indexOf('=')>=0){hash='';hit=true;}
if(!hit)return;
if(prefill){try{window.sessionStorage.setItem(${JSON.stringify(PREFILL_KEY)},JSON.stringify(found));}catch(e){}}
window.history.replaceState(window.history.state,'',u.pathname+u.search+hash);
}catch(e){}};
window.__ssStripPii();
})();`;
