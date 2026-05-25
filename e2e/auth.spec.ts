import { test, expect } from "@playwright/test";

test.describe("Auth pages", () => {
  test("sign in page loads", async ({ page }) => {
    await page.goto("/auth/signin");
    await expect(
      page.getByRole("heading", { name: /sign in to tabula/i }),
    ).toBeVisible();
  });

  test("sign in page has OAuth buttons", async ({ page }) => {
    await page.goto("/auth/signin");
    await expect(
      page.getByRole("button", { name: /google/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /github/i }),
    ).toBeVisible();
  });

  test("sign up redirects to sign in", async ({ page }) => {
    await page.goto("/auth/signup");
    await page.waitForURL("/auth/signin");
    await expect(
      page.getByRole("heading", { name: /sign in to tabula/i }),
    ).toBeVisible();
  });

  test("verify page loads", async ({ page }) => {
    await page.goto("/auth/verify");
    await expect(page.getByText(/check your email/i)).toBeVisible();
  });

  test("unauthenticated dashboard access redirects to sign in", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("/auth/signin**");
    await expect(
      page.getByRole("heading", { name: /sign in to tabula/i }),
    ).toBeVisible();
  });
});
