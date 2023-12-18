import { Page } from "@playwright/test";

export const getDashboardRoute = async ({
  page,
  status = 200,
  json
}: {
  page: Page;
  status?: number;
  json: any;
}) => {
  await page.route(`**/*/dashboard*`, async route => {
    await route.fulfill({ json, status });
  });
};
