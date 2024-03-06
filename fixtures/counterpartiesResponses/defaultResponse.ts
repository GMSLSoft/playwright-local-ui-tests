import {
  counterpartyA,
  counterpartyB,
  counterpartyC,
  counterpartyD,
  counterpartyE
} from "support/keyData/counterparties";

export const defaultCounterpartiesResponse = {
  counterparties: [
    {
      counterpartyId: counterpartyA.id,
      counterpartyName: {
        value: counterpartyA.name,
        isEditable: false
      },
      nationalGasEntryActivityNumber: {
        value: "000001",
        isEditable: false
      },
      nationalGasExitActivityNumber: {
        value: "900001",
        isEditable: false
      },
      nationalGasShipperCode: {
        value: "COA",
        isEditable: false
      },
      austriaShipperCodes: ["GLENA"],
      fluxysTradingCodes: ["ZHAAAA", "ZHAAAB"],
      gtsShipperCodes: ["GSCPA"],
      trfShipperCodes: ["GFAAAA"],
      theHShipperCodes: ["THE0BFH000000001", "THE0BFH000000091"],
      theLShipperCodes: ["THE0BFL000000001", "THE0BFL000000081"]
    },
    {
      counterpartyId: counterpartyB.id,
      counterpartyName: {
        value: counterpartyB.name,
        isEditable: false
      },
      nationalGasEntryActivityNumber: {
        value: "000002",
        isEditable: false
      },
      nationalGasExitActivityNumber: {
        value: "900002",
        isEditable: false
      },
      nationalGasShipperCode: {
        value: "COB",
        isEditable: false
      },
      austriaShipperCodes: ["GLENB"],
      fluxysTradingCodes: ["ZHBBBB", "ZHBBBC"],
      gtsShipperCodes: ["GSCPB"],
      trfShipperCodes: ["GFBBBB"],
      theHShipperCodes: ["THE0BFH000000002"],
      theLShipperCodes: ["THE0BFL000000002"]
    },
    {
      counterpartyId: counterpartyC.id,
      counterpartyName: {
        value: counterpartyC.name,
        isEditable: false
      },
      nationalGasEntryActivityNumber: {
        value: "000003",
        isEditable: false
      },
      nationalGasExitActivityNumber: {
        value: "900003",
        isEditable: false
      },
      nationalGasShipperCode: {
        value: "COE",
        isEditable: false
      },
      austriaShipperCodes: ["GLENC", "GLEND"],
      fluxysTradingCodes: ["ZHCCCC"],
      gtsShipperCodes: [],
      trfShipperCodes: ["GFCCCC"],
      theHShipperCodes: ["THE0BFH000000003"],
      theLShipperCodes: ["THE0BFL000000003"]
    },
    {
      counterpartyId: counterpartyD.id,
      counterpartyName: {
        value: counterpartyD.name,
        isEditable: false
      },
      nationalGasEntryActivityNumber: null,
      nationalGasExitActivityNumber: null,
      nationalGasShipperCode: null,
      austriaShipperCodes: [],
      fluxysTradingCodes: [],
      gtsShipperCodes: ["GSCPD"],
      trfShipperCodes: [],
      theHShipperCodes: [],
      theLShipperCodes: []
    },
    {
      counterpartyId: counterpartyE.id,
      counterpartyName: {
        value: counterpartyE.name,
        isEditable: false
      },
      nationalGasEntryActivityNumber: {
        value: "000005",
        isEditable: false
      },
      nationalGasExitActivityNumber: {
        value: "900005",
        isEditable: false
      },

      nationalGasShipperCode: {
        value: "COF",
        isEditable: false
      },
      austriaShipperCodes: ["GLENE"],
      fluxysTradingCodes: ["ZHEEEE"],
      gtsShipperCodes: ["GSCPE"],
      trfShipperCodes: ["GFEEEE"],
      theHShipperCodes: ["THE0BFH000000005"],
      theLShipperCodes: ["THE0BFL000000005"]
    }
  ]
};
