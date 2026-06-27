// utils/idGenerator.ts
export function generateUUID(): string {
  // Verifică dacă crypto.randomUUID există (browser modern, HTTPS)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  
  // Fallback pentru browsere vechi sau HTTP
  console.warn('crypto.randomUUID() not available, using fallback');
  
  // RFC 4122 versiunea 4 - UUID v4 manual
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}