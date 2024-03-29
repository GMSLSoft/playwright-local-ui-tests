import { defaultCustomerFeaturesResponse } from "@/fixtures/customerFeaturesResponses/defaultResponse";
import { singleCustomerResponse } from "@/fixtures/customerResponses/singleCustomerResponse";
import { defaultDashboardResponse } from "@/fixtures/dashboardResponses/defaultResponse";
import {
  postFakeCognitoSignInRoute,
  mockDuoRedirectRoute,
  postFakeCognitoSendCustomChallengeAnswerRoute,
  getUserCustomersRoute,
  getAuthRoute,
  getCurrentGasDateRoute
} from "@/support/endpointRoutes/authenticationRoutes";
import { getDashboardRoute } from "@/support/endpointRoutes/dashboardRoutes";
import { getCustomerFeaturesRoute } from "@/support/endpointRoutes/sharedRoutes";
import { waitForPulsatingDotsToNotExist } from "@/support/pageHelpers/loadingIndicators";
import { test as base, expect } from "@playwright/test";

const test = base.extend({
  storageState: async ({}, use) => {
    const blankStorageState = {
      cookies: [],
      origins: []
    };
    await use(blankStorageState);
  },
  userSpecifiedEnvironmentVariable: async ({}, use) => {
    await use({ extendedBaseUsed: true });
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

test("Test successful log in", async ({
  page,
  userSpecifiedEnvironmentVariable
}) => {
  await page.goto("/");

  // proof of extended base use, should be enabled through TS
  // console.log appears in "TEST RESULTS" tab
  console.log(userSpecifiedEnvironmentVariable.extendedBaseUsed);

  await waitForPulsatingDotsToNotExist({ page: page });

  await expect(page).toHaveTitle("Login - Chorus");

  await page.getByLabel("Username").fill(process.env.PLAYWRIGHT_USERNAME);
  await page.getByLabel("Password").fill(process.env.PLAYWRIGHT_PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();

  await page.waitForResponse("**/dashboard*");
  await waitForPulsatingDotsToNotExist({ page });

  await expect(page.getByRole("heading", { name: "Page Title" })).toHaveText(
    "Dashboard"
  );
});
