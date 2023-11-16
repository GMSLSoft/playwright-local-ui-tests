import { dateString } from "../../support/dateString";

export const defaultDashboardResponse = {
  gasDateOverviews: [
    {
      gasDate: dateString.plus0.iso,
      nominationsStatuses: {
        balanceStatus: "balanced",
        communicationStatus: {
          status: "delivered",
          timestamp: null,
          notes: []
        },
        nominationStatus: { status: "accepted", notes: [] },
        matchingStatus: { status: "matched", notes: [] }
      },
      contractsStatuses: {
        responseStatus: "allSentReceived",
        matchingStatus: { status: "matched", notes: [] }
      }
    },
    {
      gasDate: dateString.plus1.iso,
      nominationsStatuses: {
        balanceStatus: "imbalanced",
        communicationStatus: {
          status: "failed",
          timestamp: null,
          notes: ["Example Note: 1", "Example Note: 2"]
        },
        nominationStatus: {
          status: "remarks",
          notes: []
        },
        matchingStatus: { status: "mismatched", notes: [] }
      },
      contractsStatuses: {
        responseStatus: "pendingResponse",
        matchingStatus: { status: "mismatched", notes: [] }
      }
    }
  ]
};
