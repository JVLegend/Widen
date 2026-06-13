import { describe, expect, it } from "vitest";
import { hashPassword, isHashedPassword, verifyPassword } from "../password";

describe("password helpers", () => {
  it("hashes and verifies passwords", () => {
    const hash = hashPassword("123456");

    expect(hash).not.toBe("123456");
    expect(isHashedPassword(hash)).toBe(true);
    expect(verifyPassword("123456", hash)).toBe(true);
    expect(verifyPassword("wrong", hash)).toBe(false);
  });

  it("keeps legacy plaintext passwords verifiable for migration", () => {
    expect(isHashedPassword("123456")).toBe(false);
    expect(verifyPassword("123456", "123456")).toBe(true);
    expect(verifyPassword("wrong", "123456")).toBe(false);
  });
});
