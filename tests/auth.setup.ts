import { defaultCustomerFeaturesResponse } from "@/fixtures/customerFeaturesResponses/defaultResponse";
import { singleCustomerResponse } from "@/fixtures/customerResponses/singleCustomerResponse";
import { defaultDashboardResponse } from "@/fixtures/dashboardResponses/defaultResponse";
import {
  getUserCustomersRoute,
  getAuthRoute,
  getCurrentGasDateRoute
} from "@/support/endpointRoutes/authenticationRoutes";
import { getDashboardRoute } from "@/support/endpointRoutes/dashboardRoutes";
import { getCustomerFeaturesRoute } from "@/support/endpointRoutes/sharedRoutes";
import { mockLogin } from "@/support/pageHelpers/loginHelpers";
import { test as setup, expect } from "@playwright/test";

setup("authenticate", async ({ page }) => {
  // navigate to unauthenticated page state
  await page.goto("/");
  await expect(page).toHaveTitle("Login - Chorus");
  await expect(page.getByLabel("Username")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();

  // add valid token to browser context local storage
  await mockLogin({ page });

  // add mock routes
  await getUserCustomersRoute({ page, json: singleCustomerResponse });
  await getAuthRoute({ page });
  await getCustomerFeaturesRoute({
    page,
    json: defaultCustomerFeaturesResponse
  });
  await getCurrentGasDateRoute({ page });
  await getDashboardRoute({ page, json: defaultDashboardResponse });

  // navigate to authenticated page state
  await page.goto("/");
  await expect(page).toHaveTitle("Dashboard - Chorus");

  await expect(page.getByRole("heading", { name: "Page Title" })).toHaveText(
    "Dashboard"
  );

  // store authenticated page state
  const authFile = ".auth/authenticated-user.json";
  await page.context().storageState({ path: authFile });
});
