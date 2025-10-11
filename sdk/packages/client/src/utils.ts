export const nowIso = () => new Date().toISOString();
export const uid = (prefix = "a_") => prefix + Math.random().toString(36).slice(2, 10);
