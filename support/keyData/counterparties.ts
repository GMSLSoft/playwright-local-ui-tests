export const counterpartyA = {
  id: 1,
  shipperCode: "COUNTERPARTYA",
  name: "Counterparty A",
};

export const counterpartyB = {
  id: 2,
  shipperCode: "COUNTERPARTYB",
  name: "Counterparty B",
};

export const counterpartyC = {
  id: 3,
  shipperCode: "COUNTERPARTYC",
  name: "Counterparty C",
};

export const counterpartyD = {
  id: 4,
  shipperCode: "COUNTERPARTYD",
  name: "Counterparty D",
};

export const counterpartyE = {
  id: 5,
  shipperCode: "COUNTERPARTYE",
  name: "Counterparty E",
};

export const allCounterparties = [
  counterpartyA,
  counterpartyB,
  counterpartyC,
  counterpartyD,
  counterpartyE,
];

export const counterpartyNames = allCounterparties.map(
  (counterparty) => counterparty.name,
);
