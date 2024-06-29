export const SLEEPS = {
  short: 1000,
  medium: 3000,
  long: 5000,
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
