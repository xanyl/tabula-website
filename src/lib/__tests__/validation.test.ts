import { describe, it, expect } from "vitest";
import { validateContactForm } from "@/lib/validation";

describe("validateContactForm", () => {
  it("returns an error when name is missing", () => {
    const formData = new FormData();
    formData.set("email", "test@example.com");
    formData.set("message", "Hello");
    const result = validateContactForm(formData);
    expect(result).toEqual({ error: "Name, email, and message are required." });
  });

  it("returns an error when email is missing", () => {
    const formData = new FormData();
    formData.set("name", "Test User");
    formData.set("message", "Hello");
    const result = validateContactForm(formData);
    expect(result).toEqual({ error: "Name, email, and message are required." });
  });

  it("returns an error when message is missing", () => {
    const formData = new FormData();
    formData.set("name", "Test User");
    formData.set("email", "test@example.com");
    const result = validateContactForm(formData);
    expect(result).toEqual({ error: "Name, email, and message are required." });
  });

  it("returns an error for invalid email format", () => {
    const formData = new FormData();
    formData.set("name", "Test User");
    formData.set("email", "not-an-email");
    formData.set("message", "Hello");
    const result = validateContactForm(formData);
    expect(result).toEqual({ error: "Please enter a valid email address." });
  });

  it("returns null for valid form data", () => {
    const formData = new FormData();
    formData.set("name", "Test User");
    formData.set("email", "test@example.com");
    formData.set("message", "I need help with workflow automation");
    const result = validateContactForm(formData);
    expect(result).toBeNull();
  });
});
