import { defaultCustomerFeaturesResponse } from "@/fixtures/customerFeaturesResponses/defaultResponse";
import { singleCustomerResponse } from "@/fixtures/customerResponses/singleCustomerResponse";
import { defaultDashboardResponse } from "@/fixtures/dashboardResponses/defaultResponse";
import { dateString } from "@/support/dateString";
import {
  getUserCustomersRoute,
  getAuthRoute,
  getCurrentGasDateRoute
} from "@/support/endpointRoutes/authenticationRoutes";
import { getDashboardRoute } from "@/support/endpointRoutes/dashboardRoutes";
import { getCustomerFeaturesRoute } from "@/support/endpointRoutes/sharedRoutes";
import { waitForPulsatingDotsToNotExist } from "@/support/pageHelpers/loadingIndicators";
import { test, expect } from "@playwright/test";
import * as path from "path";
import * as sinon from "sinon";

test.beforeEach(async ({ page, context }) => {
  await getUserCustomersRoute({ page, json: singleCustomerResponse });
  await getAuthRoute({ page });
  await getCustomerFeaturesRoute({
    page,
    json: defaultCustomerFeaturesResponse
  });
  await getCurrentGasDateRoute({ page });
  await getDashboardRoute({ page, json: defaultDashboardResponse });

  // add sinon to all page contexts
  await context.addInitScript({
    path: path.join(__dirname, "..", "./node_modules/sinon/pkg/sinon.js")
  });

  await context.addInitScript(dateString => {
    window.__clock = sinon.useFakeTimers(new Date(dateString));
  }, dateString.plus0.iso);
});

test("Test moving time", async ({ page }) => {
  await page.goto("/");

  await page.waitForResponse("**/dashboard*");
  await waitForPulsatingDotsToNotExist({ page });

  await expect(
    page.getByLabel("15/06/2020").getByText("Last updated")
  ).toHaveText("Last updated 00:00");

  const oneMinute = 1000 * 60;
  await tick({ page, tickInMilliseconds: oneMinute });

  await page.waitForResponse("**/dashboard*");
  await waitForPulsatingDotsToNotExist({ page });

  await expect(
    page.getByLabel("15/06/2020").getByText("Last updated")
  ).toHaveText("Last updated 00:01");

  const oneHour = oneMinute * 60;
  await tick({ page, tickInMilliseconds: oneHour });

  await page.waitForResponse("**/dashboard*");
  await waitForPulsatingDotsToNotExist({ page });

  await expect(
    page.getByLabel("15/06/2020").getByText("Last updated")
  ).toHaveText("Last updated 01:01");
});
