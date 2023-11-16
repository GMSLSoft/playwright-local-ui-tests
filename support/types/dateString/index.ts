export const allowedGasDateOffsets = [
  "currentGasDate",
  "gasDateAhead",
] as const;

export type OffsetGasDate = (typeof allowedGasDateOffsets)[number];
export type AbsoluteGasDate = `${string}-${string}-${string}`;
export type GasDateParameter = OffsetGasDate | AbsoluteGasDate;

export type DateRepresentations = {
  label: string;
  iso: AbsoluteGasDate;
  datePicker: string;
};

export type DateStrings = {
  minus2: DateRepresentations;
  minus1: DateRepresentations;
  plus0: DateRepresentations;
  plus1: DateRepresentations;
  plus2: DateRepresentations;
  plus3: DateRepresentations;
};
