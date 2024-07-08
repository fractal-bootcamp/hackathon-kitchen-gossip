export const getFirstNonNull = (...values: any[]): any => {
  return values.find((value) => value !== null && value !== undefined);
};
