import { defineConfig, devices } from "@playwright/test";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL ?? "";
const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "mobile",
      use: {
        ...devices["Pixel 7"],
        browserName: "chromium",
      },
    },
    {
      name: "tablet",
      use: {
        viewport: { width: 768, height: 1024 },
        browserName: "chromium",
        isMobile: false,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: "npx next dev --port 3000",
    url: "http://localhost:3000/login",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnon,
      NEXT_PUBLIC_DEMO_EMAIL: demoEmail,
      NEXT_PUBLIC_DEMO_PASSWORD: demoPassword,
    },
  },
});
