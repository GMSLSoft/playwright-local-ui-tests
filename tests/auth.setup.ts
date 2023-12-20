import { test as setup, expect } from "@playwright/test";
import { createToken } from "../support/authentication";
import { singleCustomerResponse } from "../fixtures/customerResponses/singleCustomerResponse";
import { defaultCustomerFeaturesResponse } from "../fixtures/customerFeaturesResponses/defaultResponse";
import { dateString } from "../support/dateString";
import { defaultDashboardResponse } from "../fixtures/dashboardResponses/defaultResponse";

const validToken = createToken({
  authTime: new Date(),
  iotTopic: "_IOT_TOPIC_"
});

setup("authenticate", async ({ page }) => {
  // navigate to unauthenticated page state
  await page.goto("/");
  await expect(page).toHaveTitle("Login - Chorus");

  // add valid token to browser context local storage
  await page.evaluate(validToken => {
    localStorage.setItem("userIdJwtToken", validToken);
  }, validToken);

  // add route mocks here

  await page.route("**/*/userCustomers", async route => {
    const json = singleCustomerResponse;
    await route.fulfill({ json });
  });

  await page.route(`**/*/auth`, async route => {
    const json = { id_token: validToken };
    await route.fulfill({ json });
  });

  await page.route(`**/*/customerFeatures`, async route => {
    const json = defaultCustomerFeaturesResponse;
    await route.fulfill({ json });
  });

  await page.route(`**/*/currentGasDate`, async route => {
    const json = { currentGasDate: dateString.plus0.iso };
    await route.fulfill({ json });
  });

  await page.route(`**/*/dashboard*`, async route => {
    const json = defaultDashboardResponse;
    await route.fulfill({ json });
  });

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
