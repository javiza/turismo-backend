export function getBcryptRounds(): number {
  const raw = process.env.BCRYPT_ROUNDS;
  const parsed = raw ? parseInt(raw, 10) : NaN;
  if (Number.isFinite(parsed) && parsed > 0) return parsed;
  return 10; // default safe value
}
