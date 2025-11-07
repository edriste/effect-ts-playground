let firstCall = true;

export async function flakyFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  if (firstCall) {
    firstCall = false;
    console.warn("Simulated network error: failing first request");
    throw new Error("Simulated network error");
  }

  return fetch(url, options);
}
