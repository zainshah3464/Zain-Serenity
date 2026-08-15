const rateMap = new Map<string, { count: number; start: number }>();

export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000
): { ok: boolean; remaining: number } {
  const now = Date.now();
  const record = rateMap.get(key);

  if (!record || now - record.start > windowMs) {
    rateMap.set(key, { count: 1, start: now });
    return { ok: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { ok: false, remaining: 0 };
  }

  record.count++;
  return { ok: true, remaining: limit - record.count };
}

// Clear old entries every 10 minutes to prevent memory leaks
setInterval(() => {
  const threshold = Date.now() - 10 * 60 * 1000;
  for (const [key, record] of rateMap) {
    if (record.start < threshold) rateMap.delete(key);
  }
}, 10 * 60 * 1000);