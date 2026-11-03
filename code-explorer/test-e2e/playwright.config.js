
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();
export default defineConfig({
  testDir: './tests',

  fullyParallel: true,

  reporter: 'html',

  timeout: 30_000,

  expect: {
    timeout: 5_000,
  },

  use: {
    browserName: 'chromium',
baseURL: process.env.BASE_URL || 'http://localhost:5173',
    // Desktop Full HD
    viewport: {
      width: 1920,
      height: 1080,
    },

    // Device pixel ratio
    deviceScaleFactor: 1,

    // Chạy có giao diện trình duyệt
    headless: false,

    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',

    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'desktop-full-hd',
      use: {
        browserName: 'chromium',
        viewport: {
          width: 1920,
          height: 1080,
        },
      },
    },
  ],
});
