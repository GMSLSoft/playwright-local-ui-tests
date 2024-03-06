import { BrowserContext, Page } from "@playwright/test";
import * as sinon from "sinon";
import * as path from "path";

const addSinonFakeTimerToContext = async ({
  context
}: {
  context: BrowserContext;
}) => {
  await context.addInitScript({
    path: path.join(process.cwd(), "./node_modules/sinon/pkg/sinon.js")
  });
};

const setSinonFakeDateTimeForContext = async ({
  context,
  dateTimeString
}: {
  context: BrowserContext;
  dateTimeString: string;
}) => {
  await context.addInitScript(dateTimeString => {
    window.__clock = sinon.useFakeTimers({
      now: new Date(dateTimeString),
      toFake: ["setInterval", "clearInterval", "Date" /*,"setTimeout"*/]
    });
  }, dateTimeString);
};

export const setupSinonFakeDateTime = async ({
  context,
  dateTimeString
}: {
  context: BrowserContext;
  dateTimeString: string;
}) => {
  await addSinonFakeTimerToContext({ context });
  await setSinonFakeDateTimeForContext({ context, dateTimeString });
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
