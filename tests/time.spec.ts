import { defaultCustomerFeaturesResponse } from "@/fixtures/customerFeaturesResponses/defaultResponse";
import { singleCustomerResponse } from "@/fixtures/customerResponses/singleCustomerResponse";
import { defaultDashboardResponse } from "@/fixtures/dashboardResponses/defaultResponse";
import { createToken } from "@/support/authentication";
import { dateString } from "@/support/dateString";
import {
  getUserCustomersRoute,
  getAuthRoute,
  getCurrentGasDateRoute
} from "@/support/endpointRoutes/authenticationRoutes";
import { getDashboardRoute } from "@/support/endpointRoutes/dashboardRoutes";
import { getCustomerFeaturesRoute } from "@/support/endpointRoutes/sharedRoutes";
import { waitForPulsatingDotsToNotExist } from "@/support/pageHelpers/loadingIndicators";
import { mockLogin } from "@/support/pageHelpers/loginHelpers";
import {
  setupSinonFakeDateTime,
  tickSinonFakeDateTime
} from "@/support/pageHelpers/sinonTimeHelpers";
import { test as base, expect } from "@playwright/test";

const oneMinute = 1000 * 60;
const oneHour = oneMinute * 60;

const authenticatedTest = base;

// override BrowserContext
const unauthenticatedTest = base.extend({
  storageState: async ({ baseURL }, use) => {
    const secondOfTheMonth = new Date(2010, 0, 2, 0, 0, 0);
    const secondOfTheMonthStorageState = {
      cookies: [],
      origins: [
        {
          origin: baseURL,
          localStorage: [
            {
              name: "userIdJwtToken",
              value: createToken({ authTime: secondOfTheMonth })
            }
          ]
        }
      ]
    };
    await use(secondOfTheMonthStorageState);
  }
});

unauthenticatedTest.beforeEach(async ({ page }) => {
  await getUserCustomersRoute({ page, json: singleCustomerResponse });
  await getAuthRoute({ page });
  await getCustomerFeaturesRoute({
    page,
    json: defaultCustomerFeaturesResponse
  });
  await getCurrentGasDateRoute({ page });
  await getDashboardRoute({ page, json: defaultDashboardResponse });
});

authenticatedTest.beforeEach(async ({ page }) => {
  await getUserCustomersRoute({ page, json: singleCustomerResponse });
  await getAuthRoute({ page });
  await getCustomerFeaturesRoute({
    page,
    json: defaultCustomerFeaturesResponse
  });
  await getCurrentGasDateRoute({ page });
  await getDashboardRoute({ page, json: defaultDashboardResponse });
});

// use authenticated (default) BrowserContext
authenticatedTest("Test moving time", async ({ page, context }) => {
  await setupSinonFakeDateTime({
    context,
    dateTimeString: dateString.plus0.iso
  });

  await page.goto("/");

  await page.waitForResponse("**/dashboard*");
  await waitForPulsatingDotsToNotExist({ page });

  await expect(
    page.getByLabel("15/06/2020").getByText("Last updated")
  ).toHaveText("Last updated 00:00");
  await tickSinonFakeDateTime({ page, tickInMilliseconds: oneMinute });

  await page.waitForResponse("**/dashboard*");
  await waitForPulsatingDotsToNotExist({ page });

  await expect(
    page.getByLabel("15/06/2020").getByText("Last updated")
  ).toHaveText("Last updated 00:01");

  await tickSinonFakeDateTime({ page, tickInMilliseconds: oneHour });

  await page.waitForResponse("**/dashboard*");
  await waitForPulsatingDotsToNotExist({ page });

  await expect(
    page.getByLabel("15/06/2020").getByText("Last updated")
  ).toHaveText("Last updated 01:01");
});

// use authenticated (default) BrowserContext
authenticatedTest(
  "Test session expiry: relative",
  async ({ page, context }) => {
    const today = new Date();

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    // set BrowserContext current time
    // freeze time required to tick, gas date not relevant
    const randomDateTime = new Date(2000, 11, 17, 0, 0, 0);
    await setupSinonFakeDateTime({
      context,
      dateTimeString: randomDateTime.toISOString()
    });

    // mockLogin token already set by default BrowserContext

    // load page to use auth token
    await page.goto("/");

    await waitForPulsatingDotsToNotExist({ page });
    await expect(page.getByRole("heading", { name: "Page Title" })).toHaveText(
      "Dashboard"
    );

    await getAuthRoute({ page, authFromTime: tomorrow });

    // initialise auto refresh
    const customerTokenRefreshPeriod = oneMinute * 53; // 3180000ms
    await tickSinonFakeDateTime({
      page,
      tickInMilliseconds: customerTokenRefreshPeriod
    });

    // assert /auth is called, where authFromTime is _later_ than token authTime (unauthorised)
    await page.waitForResponse("**/auth");

    await page.waitForURL("**/login");

    await expect(
      page.getByText("The session expired. Please log in again.")
    ).toBeVisible();
  }
);

// use authenticated (default) BrowserContext
authenticatedTest("Test session expiry: exact", async ({ page, context }) => {
  const firstOfTheMonth = new Date(2010, 0, 1, 0, 0, 0);
  const secondOfTheMonth = new Date(2010, 0, 2, 0, 0, 0);
  const thirdOfTheMonth = new Date(2010, 0, 3, 0, 0, 0);

  await getAuthRoute({ page, authFromTime: firstOfTheMonth });

  // set BrowserContext current time
  // freeze time required to tick, gas date not relevant
  const randomDateTime = new Date(2000, 11, 17, 0, 0, 0);
  await setupSinonFakeDateTime({
    context,
    dateTimeString: randomDateTime.toISOString()
  });

  // initialise BrowserContext ready for auth token change
  await page.goto("/");

  await waitForPulsatingDotsToNotExist({ page });
  await expect(page.getByRole("heading", { name: "Page Title" })).toHaveText(
    "Dashboard"
  );

  // set BrowserContext auth token
  await mockLogin({ page, authFromTime: secondOfTheMonth });

  // refresh page to use auth token
  await page.reload();

  // assert /auth is called, where authFromTime is _earlier_ than token authTime (authorised)
  await page.waitForResponse("**/auth");

  await waitForPulsatingDotsToNotExist({ page });
  await expect(page.getByRole("heading", { name: "Page Title" })).toHaveText(
    "Dashboard"
  );

  await getAuthRoute({ page, authFromTime: thirdOfTheMonth });

  // initialise auto refresh
  const customerTokenRefreshPeriod = oneMinute * 53; // 3180000ms
  await tickSinonFakeDateTime({
    page,
    tickInMilliseconds: customerTokenRefreshPeriod
  });

  // assert /auth is called, where authFromTime is _later_ than token authTime (unauthorised)
  await page.waitForResponse("**/auth");

  await page.waitForURL("**/login");

  await expect(
    page.getByText("The session expired. Please log in again.")
  ).toBeVisible();
});

// use unauthenticated BrowserContext
unauthenticatedTest(
  "Test session expiry: preset",
  async ({ page, context }) => {
    const firstOfTheMonth = new Date(2010, 0, 1, 0, 0, 0);
    const thirdOfTheMonth = new Date(2010, 0, 3, 0, 0, 0);

    await getAuthRoute({ page, authFromTime: firstOfTheMonth });

    // set BrowserContext current time
    // freeze time required to tick, gas date not relevant
    const randomDateTime = new Date(2000, 11, 17, 0, 0, 0);
    await setupSinonFakeDateTime({
      context,
      dateTimeString: randomDateTime.toISOString()
    });

    // Unauthorised BrowserContext has already set token with auth from time
    // await mockLogin({ page, authFromTime: secondOfTheMonth });

    // navigate to page to use auth token
    await page.goto("/");

    await waitForPulsatingDotsToNotExist({ page });

    await getAuthRoute({ page, authFromTime: thirdOfTheMonth });

    // initialise auto refresh
    const customerTokenRefreshPeriod = oneMinute * 53; // 3180000ms
    await tickSinonFakeDateTime({
      page,
      tickInMilliseconds: customerTokenRefreshPeriod
    });

    // assert /auth is called, where authFromTime is _later_ than token authTime (unauthorised)
    await page.waitForResponse("**/auth");

    await page.waitForURL("**/login");

    await expect(
      page.getByText("The session expired. Please log in again.")
    ).toBeVisible();
  }
);
