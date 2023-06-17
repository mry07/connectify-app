export const abortSignal = (timeout: number) => {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), timeout || 0);

  return abortController.signal;
};
