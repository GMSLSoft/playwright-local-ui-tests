import { defaultCounterpartiesResponse } from "@/fixtures/counterpartiesResponses/defaultResponse";
import { defaultCustomerFeaturesResponse } from "@/fixtures/customerFeaturesResponses/defaultResponse";
import { defaultCustomerGtsSettingsResponse } from "@/fixtures/customerGtsSettingsResponses/defaultResponse";
import { singleCustomerResponse } from "@/fixtures/customerResponses/singleCustomerResponse";
import {
  getUserCustomersRoute,
  getAuthRoute,
  getCurrentGasDateRoute
} from "@/support/endpointRoutes/authenticationRoutes";
import {
  getCounterpartiesRoute,
  getCustomerGtsSettingsRoute
} from "@/support/endpointRoutes/configurationRoutes";
import { getCustomerFeaturesRoute } from "@/support/endpointRoutes/sharedRoutes";
import { CapacityBookingOptionLabel } from "@/support/label";
import { waitForPulsatingDotsToNotExist } from "@/support/pageHelpers/loadingIndicators";
import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await getUserCustomersRoute({ page, json: singleCustomerResponse });
  await getAuthRoute({ page });
  await getCustomerFeaturesRoute({
    page,
    json: defaultCustomerFeaturesResponse
  });
  await getCurrentGasDateRoute({ page });
  await getCustomerGtsSettingsRoute({
    page,
    json: defaultCustomerGtsSettingsResponse
  });
  await getCounterpartiesRoute({ page, json: defaultCounterpartiesResponse });
});

test.beforeEach(async ({ page }) => {
  await page.goto("/configuration/gts-settings");

  await page.waitForResponse("**/customerFeatures*");
  await page.waitForResponse("**/customerGtsSettings*");
  await waitForPulsatingDotsToNotExist({ page });

  await expect(page.getByRole("heading", { name: "Page Title" })).toHaveText(
    "Configuration"
  );

  await expect(
    page.getByRole("link", { name: "GTS Settings" })
  ).toHaveAttribute("aria-current");

  await page
    .locator("label", {
      has: page.getByLabel(CapacityBookingOptionLabel.EntryAndExit)
    })
    .click();
});

test.describe("Test confirmation promprs", () => {
  test.describe("When the prompt is dismissed", () => {
    test("Then the user remains on the GTS Settings page", async ({ page }) => {
      page.on("dialog", async dialog => {
        expect(dialog.message()).toContain(
          "You have unsaved changes. Are you sure you want to discard these changes?"
        );

        // 'Cancel' on confirmation prompt
        await dialog.dismiss();
      });

      await page.getByRole("link", { name: "Counterparties" }).click();

      await expect(
        page.getByRole("link", { name: "GTS Settings" })
      ).toHaveAttribute("aria-current");
    });
  });

  test.describe("When the prompt is accepted", () => {
    test("Then the user is routed to the counterparties page", async ({
      page
    }) => {
      page.on("dialog", async dialog => {
        expect(dialog.message()).toContain(
          "You have unsaved changes. Are you sure you want to discard these changes?"
        );

        // 'OK' on confirmation prompt
        await dialog.accept();
      });

      await page.getByRole("link", { name: "Counterparties" }).click();

      await expect(
        page.getByRole("link", { name: "Counterparties" })
      ).toHaveAttribute("aria-current");
    });
  });
});
