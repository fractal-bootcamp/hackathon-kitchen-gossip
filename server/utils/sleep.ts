import { AppConfig } from "../config/AppConfig"

export const SLEEPS = {
  short: 1000,
  githubApiSleep: AppConfig.githubApiSleep,
  long: 10000,
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
