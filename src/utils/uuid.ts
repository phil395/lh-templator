export const uuid = (): string => {
  if (process.env.NODE_ENV === "test" && typeof crypto === "undefined") {
    return Math.random().toString();
  }
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // crypto.randomUUID polyfill
  // https://stackoverflow.com/a/2117523/2800218
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    // eslint-disable-next-line
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16),
  );
};
