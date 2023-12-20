import { Page, expect } from "@playwright/test";

const LoadingIndicatorTestId = {
  PulsatingDots: "pulsating-dots",
  Spinner: "spinner-button-loader",
  Skeleton: "skeleton-card-loader"
};

export const waitForPulsatingDotsToNotExist = async ({
  page
}: {
  page: Page;
}) => {
  await expect(
    page.getByTestId(LoadingIndicatorTestId.PulsatingDots)
  ).toHaveCount(0);
};
