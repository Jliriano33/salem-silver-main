// Carries a seller's details between pages without putting them in the URL (F-004).
//
// Meta's pixel script sends the full page URL to Meta's gateway, so an address, name, email or phone in a
// query string goes to Meta with every event. Pages hand these values over in sessionStorage instead: it
// stays in this browser tab and is gone when the tab closes.
//
// Old links and ads may still arrive with ?address=&n=&e=&p=. STRIP_PII_SCRIPT runs in the page head,
// before Meta's script or the app starts, moves those values into the same storage and removes them from
// the address bar. It keeps every other parameter (UTMs, interested_in_agent).

export const PREFILL_KEY = 'ss_lead_prefill';

export interface Prefill {
  address?: string;
  name?: string;
  email?: string;
  phone?: string;
}

/** Query parameter, and the Prefill field it fills. */
export const PII_QUERY_KEYS: Record<string, keyof Prefill> = { address: 'address', n: 'name', e: 'email', p: 'phone' };

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

export function savePrefill(values: Prefill): void {
  try {
    window.sessionStorage.setItem(PREFILL_KEY, JSON.stringify({ ...readPrefill(), ...values }));
  } catch {
    // Storage blocked: the next page simply asks again.
  }
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
var u=new URL(window.location.href),keys=${JSON.stringify(PII_QUERY_KEYS)},found={},hit=false,k;
for(k in keys){if(u.searchParams.has(k)){found[keys[k]]=u.searchParams.get(k);u.searchParams.delete(k);hit=true;}}
if(!hit)return;
try{var prev=JSON.parse(window.sessionStorage.getItem(${JSON.stringify(PREFILL_KEY)})||'{}')||{};
for(k in found){if(found[k])prev[k]=found[k];}
window.sessionStorage.setItem(${JSON.stringify(PREFILL_KEY)},JSON.stringify(prev));}catch(e){}
window.history.replaceState(window.history.state,'',u.pathname+u.search+u.hash);
}catch(e){}};
window.__ssStripPii();
})();`;
