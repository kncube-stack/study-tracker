export const STORAGE_KEY = 'lituk-tracker-v1';
export const CHECKLIST_KEY = 'lituk-checklist-v1';
export const emptyProgress = () => ({ scores: {}, checks: {}, startDate: null });
const taskCounts = [4,4,5,5,5,5,6,4,4,4,4,3,5,4,4,3,4,4,4,4,4];
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const day = key => /^(?:[1-9]|1[0-9]|2[01])$/.test(key);
export function validateProgress(data) {
  if (!object(data) || !object(data.scores) || !object(data.checks)) throw new Error('Invalid progress data.');
  const result = emptyProgress();
  for (const [key, value] of Object.entries(data.scores)) {
    if (!day(key) || !(value === '' || (Number.isInteger(value) && value >= 0 && value <= 24))) throw new Error('Invalid score.');
    result.scores[key] = value;
  }
  for (const [key, value] of Object.entries(data.checks)) {
    if (!day(key) || !Array.isArray(value) || value.length > taskCounts[Number(key)-1] || !value.every(v => v === null || typeof v === 'boolean')) throw new Error('Invalid task checks.');
    // Sparse legacy arrays are serialized as null; preserve their unchecked meaning.
    result.checks[key] = value.map(Boolean);
  }
  if (data.startDate != null) {
    if (typeof data.startDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.startDate) || !Number.isFinite(Date.parse(data.startDate)) || new Date(data.startDate).toISOString().slice(0,10) !== data.startDate) throw new Error('Invalid date.');
    result.startDate = data.startDate;
  }
  return result;
}
export function decodeProgress(code) {
  if (typeof code !== 'string' || code.length > 20000) throw new Error('Save code is too large.');
  const bytes = Uint8Array.from(atob(code.trim()), c => c.charCodeAt(0));
  return validateProgress(JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)));
}
export function encodeProgress(data) {
  return btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(validateProgress(data)))));
}
export function loadProgress(storage) {
  let raw = null;
  try {
    raw = (storage ?? window.localStorage).getItem(STORAGE_KEY);
    return { data: raw === null ? emptyProgress() : validateProgress(JSON.parse(raw)), raw, error: '' };
  } catch {
    return { data: emptyProgress(), raw, error: 'Saved progress could not be read. The original is untouched. Saving is paused; reload or restore a valid backup to continue.' };
  }
}
export function incomingProgress(location) {
  const url = new URL(location.href);
  const code = new URLSearchParams(url.hash.slice(1)).get('sync') ?? url.searchParams.get('sync');
  if (code === null) return { pending: null, error: '' };
  try { return { pending: decodeProgress(code), error: '' }; }
  catch { return { pending: null, error: 'This sync link is invalid. Your existing progress has not changed.' }; }
}
export function loadChecklist(storage) {
  try {
    const raw = (storage ?? window.localStorage).getItem(CHECKLIST_KEY);
    const data = JSON.parse(raw || '{}');
    if (!object(data) || Object.values(data).some(v => typeof v !== 'boolean')) throw new Error();
    return { data, raw, error: '' };
  } catch { return { data: {}, error: 'Checklist could not be read. Original data is untouched; checklist saving is paused.' }; }
}
