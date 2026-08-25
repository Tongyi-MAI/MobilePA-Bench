import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });

  await page.goto("http://127.0.0.1:4180/#leaderboard", {
    waitUntil: "networkidle",
  });

  const leaderboard = page.locator("#leaderboard");
  await leaderboard.waitFor({ state: "visible" });
  await page.locator("nav").evaluate((element) => {
    element.style.display = "none";
  });

  await leaderboard.screenshot({
    path: "github-pages/static/images/leaderboard.jpg",
    type: "jpeg",
    quality: 92,
    animations: "disabled",
  });
} finally {
  await browser.close();
}
