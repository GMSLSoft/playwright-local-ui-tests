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
  const unauthorisedPage = await blankContext.newPage();

  await unauthorisedPage.goto("/");

  // check at unauthorised landing page (login)
  await expect(unauthorisedPage).toHaveTitle("Login - Chorus");
  await waitForPulsatingDotsToNotExist({ page: unauthorisedPage });

  // // enter username & password
  await unauthorisedPage
    .getByLabel("Username")
    .fill(process.env.PLAYWRIGHT_USERNAME);
  await unauthorisedPage
    .getByLabel("Password")
    .fill(process.env.PLAYWRIGHT_PASSWORD);
  await unauthorisedPage.getByRole("button", { name: "Log in" }).click();

  // expect unauthorised page to not be authorised due to login credentials
  const authorisedPage = unauthorisedPage;

  // check at authorised landing page (dashboard)
  await authorisedPage.goto("/");
  await waitForPulsatingDotsToNotExist({ page: authorisedPage });

  await expect(authorisedPage).toHaveTitle("Dashboard - Chorus");

  await expect(
    authorisedPage.getByRole("heading", { name: "Page Title" })
  ).toHaveText("Dashboard");
});
