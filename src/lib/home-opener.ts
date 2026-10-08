// A fresh document is a new opening; client-side return navigation is not.
const documentVisit = String(performance.timeOrigin);
const visitKey = "dbrl-ball-opener-document";
let played = false;

export function hasPlayedHomeOpener() {
  if (played) return true;
  try {
    return sessionStorage.getItem(visitKey) === documentVisit;
  } catch {
    return false;
  }
}

export function markHomeOpenerPlayed() {
  played = true;
  try {
    sessionStorage.setItem(visitKey, documentVisit);
  } catch {
    // In-memory protection still prevents replay during return navigation.
  }
}