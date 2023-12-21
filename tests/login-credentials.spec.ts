import { test as base, expect } from "@playwright/test";
import { defaultCustomerFeaturesResponse } from "../fixtures/customerFeaturesResponses/defaultResponse";
import { singleCustomerResponse } from "../fixtures/customerResponses/singleCustomerResponse";
import { defaultDashboardResponse } from "../fixtures/dashboardResponses/defaultResponse";
import {
  getUserCustomersRoute,
  getAuthRoute,
  getCurrentGasDateRoute,
  postFakeCognitoSignInRoute,
  mockDuoRedirectRoute,
  postFakeCognitoSendCustomChallengeAnswerRoute
} from "../support/endpointRoutes/authenticationRoutes";
import { getDashboardRoute } from "../support/endpointRoutes/dashboardRoutes";
import { getCustomerFeaturesRoute } from "../support/endpointRoutes/sharedRoutes";
import { waitForPulsatingDotsToNotExist } from "../support/pageHelpers/loadingIndicators";

const test = base.extend({
  storageState: async ({}, use) => {
    const blankStorageState = {
      cookies: [],
      origins: []
    };
    await use(blankStorageState);
  }
});

test.beforeEach(async ({ page }) => {
  // add fake cognito routes
  postFakeCognitoSignInRoute({ page });
  mockDuoRedirectRoute({ page });
  postFakeCognitoSendCustomChallengeAnswerRoute({ page });

  // add page routes
  await getUserCustomersRoute({ page, json: singleCustomerResponse });
  await getAuthRoute({ page });
  await getCustomerFeaturesRoute({
    page,
    json: defaultCustomerFeaturesResponse
  });
  await getCurrentGasDateRoute({ page });
  await getDashboardRoute({ page, json: defaultDashboardResponse });
});

test("Test successful log in", async ({ page }) => {
  await page.goto("/");
  await waitForPulsatingDotsToNotExist({ page: page });

  await expect(page).toHaveTitle("Login - Chorus");

  await page.getByLabel("Username").fill(process.env.PLAYWRIGHT_USERNAME);
  await page.getByLabel("Password").fill(process.env.PLAYWRIGHT_PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();

  await waitForPulsatingDotsToNotExist({ page });

  await expect(page.getByRole("heading", { name: "Page Title" })).toHaveText(
    "Dashboard"
  );
});
