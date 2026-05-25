import { test, expect } from "@playwright/test";

test.describe("Marketing pages", () => {
  test("homepage loads and renders hero", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /turn chaos into clarity/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /start a conversation/i }).first(),
    ).toBeVisible();
  });

  test("homepage has all major sections", async ({ page }) => {
    await page.goto("/");
    // Process timeline (how-it-works)
    await expect(page.locator("#how-it-works")).toBeVisible();
    // Social proof section should have percentage text
    await page.getByText("Less manual work").scrollIntoViewIfNeeded();
    await expect(page.getByText("60%")).toBeVisible();
  });

  test("contact page renders form", async ({ page }) => {
    await page.goto("/contact");
    await expect(
      page.getByRole("heading", { name: /start a conversation/i }),
    ).toBeVisible();
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel(/work email/i)).toBeVisible();
    await expect(page.getByLabel(/what are you working on/i)).toBeVisible();
  });

  test("contact form shows validation errors", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: /send message/i }).click();
    // HTML5 validation should prevent submission — form should still be visible
    await expect(page.getByLabel("Name")).toBeVisible();
  });

  test("services page loads", async ({ page }) => {
    await page.goto("/services");
    await expect(
      page.getByRole("heading", { name: /how we work/i }),
    ).toBeVisible();
  });

  test("about page loads", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { name: /work should be meaningful/i }),
    ).toBeVisible();
  });

  test("blog listing page loads", async ({ page }) => {
    await page.goto("/blog");
    await expect(
      page.getByRole("heading", { name: /thinking on workflow/i }),
    ).toBeVisible();
  });

  test("blog post page shows 404 for non-existent slug", async ({ page }) => {
    await page.goto("/blog/non-existent-post");
    // Should show 404 content
    await expect(page.getByText("404")).toBeVisible();
  });

  test("case studies listing page loads", async ({ page }) => {
    await page.goto("/case-studies");
    await expect(
      page.getByRole("heading", { name: /results, not promises/i }),
    ).toBeVisible();
  });

  test("404 page renders for unknown routes", async ({ page }) => {
    await page.goto("/this-does-not-exist");
    await expect(page.getByText("404")).toBeVisible();
    // Note: custom not-found.tsx is only triggered within the (marketing) route group,
    // so the "Back home" link is not checked here for arbitrary unknown routes.
  });
});
