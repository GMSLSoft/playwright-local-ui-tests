import { test, expect } from "@playwright/test";
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

test("Test successful log in", async ({ browser }) => {
  const blankStorageState = {
    cookies: [],
    origins: []
  };

  // create unauthorised browserContext with blank storageState
  const blankContext = await browser.newContext({
    storageState: blankStorageState
  });

  // create new page using unauthorised browserContext
  const newPage = await blankContext.newPage();

  await newPage.goto("/");

  // check at unauthorised landing page (login)
  await expect(newPage).toHaveTitle("Login - Chorus");
  await waitForPulsatingDotsToNotExist({ page: newPage });

  //intercept post request
  postFakeCognitoSignInRoute({ page: newPage });

  // mock duo redirect
  mockDuoRedirectRoute({ page: newPage });

  // send challenge answer
  postFakeCognitoSendCustomChallengeAnswerRoute({ page: newPage });

  // add mock routes for new page context
  await getUserCustomersRoute({ page: newPage, json: singleCustomerResponse });
  await getAuthRoute({ page: newPage });
  await getCustomerFeaturesRoute({
    page: newPage,
    json: defaultCustomerFeaturesResponse
  });
  await getCurrentGasDateRoute({ page: newPage });
  await getDashboardRoute({ page: newPage, json: defaultDashboardResponse });

  // // enter username & password
  await newPage.getByLabel("Username").fill(process.env.PLAYWRIGHT_USERNAME);
  await newPage.getByLabel("Password").fill(process.env.PLAYWRIGHT_PASSWORD);
  await newPage.getByRole("button", { name: "Log in" }).click();

  // check at authorised landing page (dashboard)
  await waitForPulsatingDotsToNotExist({ page: newPage });

  await expect(newPage).toHaveTitle("Dashboard - Chorus");

  await expect(newPage.getByRole("heading", { name: "Page Title" })).toHaveText(
    "Dashboard"
  );
});
