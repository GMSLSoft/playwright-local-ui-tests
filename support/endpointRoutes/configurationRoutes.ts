import { Page } from "@playwright/test";

export const getCustomerGtsSettingsRoute = async ({
  page,
  status = 200,
  json
}: {
  page: Page;
  status?: number;
  json: any;
}) => {
  await page.route(`**/*/customerGtsSettings*`, async route => {
    await route.fulfill({ json, status });
  });
};
export const getCounterpartiesRoute = async ({
  page,
  status = 200,
  json
}: {
  page: Page;
  status?: number;
  json: any;
}) => {
  await page.route(`**/*/counterparties*`, async route => {
    await route.fulfill({ json, status });
  });
};
