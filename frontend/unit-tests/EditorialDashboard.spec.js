import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";

vi.mock("@/features/editorialDashboard/editorialServices", () => ({
  default: {
    createEvent: vi.fn(),
    updateEvent: vi.fn(),
    publishEvent: vi.fn(),
    deleteEvent: vi.fn(),
  },
}));

describe("Editorial Dashboard - Events Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
});