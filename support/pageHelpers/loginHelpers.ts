import { Page } from "@playwright/test";
import { createToken } from "../authentication";

export const mockLogin = async ({
  page,
  authFromTime = new Date()
}: {
  page: Page;
  authFromTime?: Date;
}) => {
  const validToken = createToken({ authTime: authFromTime });

  await page.evaluate(validToken => {
    localStorage.setItem("userIdJwtToken", validToken);
  }, validToken);
};
