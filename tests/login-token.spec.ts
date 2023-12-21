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

  await page.waitForResponse("**/dashboard*");
  await waitForPulsatingDotsToNotExist({ page });

  await expect(page).toHaveTitle("Dashboard - Chorus");

  await expect(page.getByRole("heading", { name: "Page Title" })).toHaveText(
    "Dashboard"
  );
});
