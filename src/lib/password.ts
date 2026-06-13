import { pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";

const HASH_PREFIX = "pbkdf2";
const DIGEST = "sha256";
const ITERATIONS = 310000;
const KEY_LENGTH = 32;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
  return [HASH_PREFIX, DIGEST, ITERATIONS, salt, hash].join("$");
}

export function isHashedPassword(value: string) {
  return value.startsWith(`${HASH_PREFIX}$`);
}

export function verifyPassword(password: string, storedPassword: string) {
  if (!isHashedPassword(storedPassword)) {
    return password === storedPassword;
  }

  const [prefix, digest, iterationsValue, salt, storedHash] = storedPassword.split("$");
  if (prefix !== HASH_PREFIX || digest !== DIGEST || !iterationsValue || !salt || !storedHash) {
    return false;
  }

  const iterations = Number(iterationsValue);
  if (!Number.isInteger(iterations) || iterations <= 0) return false;

  const computedHash = pbkdf2Sync(password, salt, iterations, KEY_LENGTH, digest).toString("hex");
  const storedBuffer = Buffer.from(storedHash, "hex");
  const computedBuffer = Buffer.from(computedHash, "hex");

  if (storedBuffer.length !== computedBuffer.length) return false;
  return timingSafeEqual(storedBuffer, computedBuffer);
}
