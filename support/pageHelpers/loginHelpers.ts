import { Page } from "@playwright/test";
import { createToken } from "../authentication";

export const mockLogin = async ({
  page,
  authTime = new Date()
}: {
  page: Page;
  authTime?: Date;
}) => {
  const validToken = createToken({ authTime });

  await page.evaluate(validToken => {
    localStorage.setItem("userIdJwtToken", validToken);
  }, validToken);
};
