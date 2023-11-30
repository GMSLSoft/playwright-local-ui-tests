import { test, expect } from "@playwright/test";

test("Test mock log in", async ({ page }) => {
  // go to unuthorised landing page (login)
  await page.goto("/");

  // check at authorised landing page (dashboard)
  await expect(page).toHaveTitle("Dashboard - Chorus");
});

test("Test log in", async ({ page }) => {
  // clear any stored tokens
  await page.evaluate(() => window.localStorage.clear());
  await page.evaluate(() => window.sessionStorage.clear());

  // go to unuthorised landing page (login)
  await page.goto("/");

  // enter username & password
  await page.getByLabel("Username").fill(process.env.PLAYWRIGHT_USERNAME);
  await page.getByLabel("Password").fill(process.env.PLAYWRIGHT_PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();

  // check at authorised landing page (dashboard)
  await expect(page).toHaveTitle("Dashboard - Chorus");
});
