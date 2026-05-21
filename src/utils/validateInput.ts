import { ApiError } from "./ApiError";

const isFieldMissing = <T>(payload: T, keys: (keyof T)[]) => {
  if (keys.some((k) => payload[k] === undefined)) {
    throw new ApiError(false, 400, "Input fields missing");
  }
};

const isEmptyValue = <T>(payload: T, keys: (keyof T)[]) => {
  if (
    keys.some(
      (k) =>
        payload[k] === null ||
        payload[k] === "" ||
        (typeof payload[k] === "string" && payload[k].trim() === ""),
    )
  ) {
    throw new ApiError(false, 400, "Input fields have empty values");
  }
};

export const validateInputs = {
  isFieldMissing,
  isEmptyValue,
};
