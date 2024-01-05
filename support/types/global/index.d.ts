import * as sinon from "sinon";

declare global {
  interface Window {
    __clock: sinon.SinonFakeTimers;
  }
}
