import { BrowserContext, Page } from "@playwright/test";
import * as sinon from "sinon";
import * as path from "path";

const setSinonFakeTimer = async ({ context }: { context: BrowserContext }) => {
  await context.addInitScript({
    path: path.join(process.cwd(), "./node_modules/sinon/pkg/sinon.js")
  });
};

export const changeSinonFakeDateTime = async ({
  context,
  dateTimeString
}: {
  context: BrowserContext;
  dateTimeString: string;
}) => {
  await context.addInitScript(dateTimeString => {
    window.__clock = sinon.useFakeTimers(new Date(dateTimeString));
  }, dateTimeString);
};

export const setupSinonFakeDateTime = async ({
  context,
  dateTimeString
}: {
  context: BrowserContext;
  dateTimeString: string;
}) => {
  await setSinonFakeTimer({ context });
  await changeSinonFakeDateTime({ context, dateTimeString });
};

export const tickSinonFakeDateTime = async ({
  page,
  tickInMilliseconds
}: {
  page: Page;
  tickInMilliseconds: number;
}) => {
  await page.evaluate(timeToTick => {
    window.__clock.tick(timeToTick);
  }, tickInMilliseconds);
};
