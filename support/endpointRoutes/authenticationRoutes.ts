import { Page } from "@playwright/test";
import { createToken } from "../authentication";
import { dateString } from "../dateString";

export const getUserCustomersRoute = async ({
  page,
  status = 200,
  json
}: {
  page: Page;
  status?: number;
  json: any;
}) => {
  await page.route("**/*/userCustomers", async route => {
    await route.fulfill({ json, status });
  });
};

export const getCurrentGasDateRoute = async ({
  page,
  status = 200,
  currentGasDate = dateString.plus0.iso
}: {
  page: Page;
  status?: number;
  currentGasDate?: string;
}) => {
  await page.route(`**/*/currentGasDate`, async route => {
    const json = { currentGasDate };
    await route.fulfill({ json, status });
  });
};

export const getAuthRoute = async ({
  page,
  status = 200,
  authTime = new Date()
}: {
  page: Page;
  status?: number;
  authTime?: Date;
}) => {
  const response =
    status === 200
      ? {
          id_token: createToken({ authTime })
        }
      : {};

  await page.route(`**/*/auth`, async route => {
    await route.fulfill({ json: response, status });
  });
};
