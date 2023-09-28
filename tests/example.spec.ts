import { test, expect } from "@playwright/test";

test("First test", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Dashboard - Chorus/);
});
