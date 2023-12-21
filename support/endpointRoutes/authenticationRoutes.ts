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

export const postFakeCognitoSignInRoute = async ({ page }: { page: Page }) => {
  await page.route(`**/*/fakeCognito/signIn`, async route => {
    await route.fulfill();
  });
};

export const mockDuoRedirectRoute = async ({ page }: { page: Page }) => {
  await page.route(`**/*/duo`, async route => {
    await route.fulfill({
      status: 303,
      headers: {
        Location: `${process.env.PLAYWRIGHT_WEBSERVER_BASEURL}/verify-multi-factor-authentication-challenge?state=__STATE__&code=__CODE__`
      }
    });
  });
};

export const postFakeCognitoSendCustomChallengeAnswerRoute = async ({
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
          userIdJwtToken: createToken({ authTime })
        }
      : {};

  await page.route(
    `**/*/fakeCognito/sendCustomChallengeAnswer`,
    async route => {
      await route.fulfill({ json: response, status });
    }
  );
};
