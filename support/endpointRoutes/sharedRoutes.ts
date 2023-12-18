import { Page } from "@playwright/test";

export const getCustomerFeaturesRoute = async ({
  page,
  status = 200,
  json
}: {
  page: Page;
  status?: number;
  json: any;
}) => {
  await page.route(`**/*/customerFeatures`, async route => {
    await route.fulfill({ json, status });
  });
};
