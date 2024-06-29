export const SLEEPS = {
  short: 1000,
  medium: 6000,
  long: 10000,
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
