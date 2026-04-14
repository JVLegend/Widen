import { describe, it, expect } from "vitest";
import { PLATFORM_LABELS, CAMPAIGN_STATUS_LABELS } from "@/lib/constants";

describe("PLATFORM_LABELS", () => {
  it("is defined and is an object", () => {
    expect(PLATFORM_LABELS).toBeDefined();
    expect(typeof PLATFORM_LABELS).toBe("object");
  });

  it("contains all expected platform keys", () => {
    expect(PLATFORM_LABELS).toHaveProperty("youtube");
    expect(PLATFORM_LABELS).toHaveProperty("instagram");
    expect(PLATFORM_LABELS).toHaveProperty("tiktok");
    expect(PLATFORM_LABELS).toHaveProperty("upload");
  });

  it("has string values for all keys", () => {
    for (const value of Object.values(PLATFORM_LABELS)) {
      expect(typeof value).toBe("string");
    }
  });
});

describe("CAMPAIGN_STATUS_LABELS", () => {
  it("is defined and is an object", () => {
    expect(CAMPAIGN_STATUS_LABELS).toBeDefined();
    expect(typeof CAMPAIGN_STATUS_LABELS).toBe("object");
  });

  it("contains all expected status keys", () => {
    expect(CAMPAIGN_STATUS_LABELS).toHaveProperty("draft");
    expect(CAMPAIGN_STATUS_LABELS).toHaveProperty("active");
    expect(CAMPAIGN_STATUS_LABELS).toHaveProperty("paused");
    expect(CAMPAIGN_STATUS_LABELS).toHaveProperty("completed");
  });

  it("has string values for all keys", () => {
    for (const value of Object.values(CAMPAIGN_STATUS_LABELS)) {
      expect(typeof value).toBe("string");
    }
  });
});
