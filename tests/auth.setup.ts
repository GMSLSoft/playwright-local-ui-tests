import { test as setup, expect } from "@playwright/test";
import { singleCustomerResponse } from "../fixtures/customerResponses/singleCustomerResponse";
import { defaultCustomerFeaturesResponse } from "../fixtures/customerFeaturesResponses/defaultResponse";
import { dateString } from "../support/dateString";
import { defaultDashboardResponse } from "../fixtures/dashboardResponses/defaultResponse";
import {
  getAuthRoute,
  getCurrentGasDateRoute,
  getUserCustomersRoute
} from "../support/endpointRoutes/authenticationRoutes";
import { getCustomerFeaturesRoute } from "../support/endpointRoutes/sharedRoutes";
import { getDashboardRoute } from "../support/endpointRoutes/dashboardRoutes";
import { mockLogin } from "../support/pageHelpers/loginHelpers";

setup("authenticate", async ({ page }) => {
  // navigate to unauthenticated page state
  await page.goto("/");
  await expect(page).toHaveTitle("Login - Chorus");

  // add valid token to browser context local storage
  await mockLogin({ page });

  // add route mocks here
  await getUserCustomersRoute({ page, json: singleCustomerResponse });
  await getAuthRoute({ page });
  await getCustomerFeaturesRoute({
    page,
    json: defaultCustomerFeaturesResponse
  });
  await getCurrentGasDateRoute({ page });
  await getDashboardRoute({ page, json: defaultDashboardResponse });

  // navigate to unauthenticated page state
  await page.goto("/");
  await expect(page).toHaveTitle("Dashboard - Chorus");

  await expect(page.getByRole("heading", { name: "Page Title" })).toHaveText(
    "Dashboard"
  );

  // store authenticated page state
  const authFile = ".auth/authenticated-user.json";
  await page.context().storageState({ path: authFile });
});
