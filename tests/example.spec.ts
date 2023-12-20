import { test, expect } from "@playwright/test";
import { defaultCustomerFeaturesResponse } from "../fixtures/customerFeaturesResponses/defaultResponse";
import { singleCustomerResponse } from "../fixtures/customerResponses/singleCustomerResponse";
import { defaultDashboardResponse } from "../fixtures/dashboardResponses/defaultResponse";
import {
  getUserCustomersRoute,
  getAuthRoute,
  getCurrentGasDateRoute
} from "../support/endpointRoutes/authenticationRoutes";
import { getDashboardRoute } from "../support/endpointRoutes/dashboardRoutes";
import { getCustomerFeaturesRoute } from "../support/endpointRoutes/sharedRoutes";
import { waitForPulsatingDotsToNotExist } from "../support/pageHelpers/loadingIndicators";

test.beforeEach(async ({ page }) => {
  // add mock routes
  await getUserCustomersRoute({ page, json: singleCustomerResponse });
  await getAuthRoute({ page });
  await getCustomerFeaturesRoute({
    page,
    json: defaultCustomerFeaturesResponse
  });
  await getCurrentGasDateRoute({ page });
  await getDashboardRoute({ page, json: defaultDashboardResponse });
});

test("Test mock log in", async ({ page }) => {
  // navigate to authenticated page state
  await page.goto("/");

  await waitForPulsatingDotsToNotExist({ page });

  await expect(page).toHaveTitle("Dashboard - Chorus");

  await expect(page.getByRole("heading", { name: "Page Title" })).toHaveText(
    "Dashboard"
  );
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
