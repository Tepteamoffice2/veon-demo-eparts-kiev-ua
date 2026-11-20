// E2E checks of the demo homepage: key scenarios from ux/demo-home.md, widths 320–1440, no-JS and reduced motion.
// Playwright and Chromium come from the studio tools (~/.veon/tools via quality/scripts/veon_pw.mjs): no extra npm dependency.
// Usage: node tests/e2e/home.e2e.mjs [url]   (default http://localhost:4321/; set VEON_WEB_STUDIO if the studio is not in ~/Documents/ai-web-studio)
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const studio = process.env.VEON_WEB_STUDIO || path.join(os.homedir(), "Documents", "ai-web-studio");
const { loadPlaywright, launchAttempts } = await import(pathToFileURL(path.join(studio, "quality", "scripts", "veon_pw.mjs")).href);
const { chromium } = loadPlaywright();
const URL_ = process.argv[2] || "http://localhost:4321/";
const H1 = "Автозапчастини для іномарок — оригінал або аналог на вибір";
const SECTIONS = ["hero", "catalog", "brands", "how", "delivery", "sto", "about", "contacts"];

let browser;
for (const o of launchAttempts()) { try { browser = await chromium.launch({ headless: true, ...o }); break; } catch { /* next */ } }
if (!browser) { console.error("No browser available"); process.exit(2); }

const results = [];
const check = (name, ok, info = "") => { results.push({ name, ok, info }); console.log(`${ok ? "PASS" : "FAIL"}  ${name}${info ? "  · " + info : ""}`); };
const page = async (opts = {}) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(URL_, { waitUntil: "networkidle" });
  return { p, ctx, errors };
};

try {
  // 1. Structure, H1, links
  {
    const { p, ctx, errors } = await page();
    check("H1 is exactly the concept text", (await p.locator("h1").innerText()).replace(/\s+/g, " ").trim() === H1);
    check("one H1", (await p.locator("h1").count()) === 1);
    const ids = await p.$$eval("main > section", (s) => s.map((x) => x.id));
    check("sections in concept order", JSON.stringify(ids) === JSON.stringify(SECTIONS), ids.join(","));
    check("html lang=uk", (await p.getAttribute("html", "lang")) === "uk");
    const hrefs = await p.$$eval("a[href]", (a) => a.map((x) => x.getAttribute("href")));
    const bad = hrefs.filter((h) => !(h.startsWith("tel:") || /^#[a-z]/.test(h) || h.startsWith("https://www.google.com/maps/")));
    check("links: only anchors, tel: and the map", bad.length === 0, bad.join(" "));
    check("no link to the current client site", !(await p.content()).includes("eparts.kiev.ua"));
    const missing = await p.$$eval('a[href^="#"]', (a) => a.map((x) => x.getAttribute("href")).filter((h) => !document.getElementById(h.slice(1))));
    check("every anchor has a target", missing.length === 0, missing.join(" "));
    check("primary CTA calls the free line", (await p.locator(".hero__call").getAttribute("href")) === "tel:0800210982");
    const fl = await p.$$eval(".future-link", (els) => els.every((e) => e.getAttribute("aria-disabled") === "true" && !e.hasAttribute("href")));
    check("FutureLink items are inactive, without href", fl);
    // tabs
    await p.click("#pick-tab-vin");
    check("tab «За VIN» shows the VIN field", await p.isVisible("#pick-vin") && !(await p.isVisible("#pick-make")));
    await p.keyboard.press("ArrowRight");
    check("arrow key moves to «За номером»", (await p.getAttribute("#pick-tab-num", "aria-selected")) === "true" && await p.isVisible("#pick-num"));
    // FutureLink note on focus
    await p.focus(".picker__search");
    await p.waitForTimeout(300);
    const op = await p.$eval(".picker__search .future-link__note", (n) => getComputedStyle(n).opacity);
    check("search button shows its note on focus", op === "1");
    check("no script errors", errors.length === 0, errors.join(" | "));
    await ctx.close();
  }

  // 2. Widths: no horizontal scroll, CTA in the first screen
  for (const [w, h] of [[320, 640], [375, 812], [390, 844], [768, 1024], [1024, 768], [1280, 800], [1440, 900]]) {
    const { p, ctx } = await page({ viewport: { width: w, height: h } });
    const sw = await p.evaluate(() => document.documentElement.scrollWidth);
    check(`${w}px: no horizontal scroll`, sw <= w, `scrollWidth ${sw}`);
    const out = await p.evaluate((vw) => [...document.querySelectorAll("main *, header *, footer *")].filter((e) => {
      if (e.closest(".visually-hidden, .future-link__note, .mnav:not([open]), .fork__cover, .how__cover, [aria-hidden='true'] svg")) return false;
      const r = e.getBoundingClientRect(); const s = getComputedStyle(e);
      return r.width > 0 && s.visibility !== "hidden" && (r.right > vw + 1 || r.left < -1);
    }).map((e) => e.tagName + "." + e.className).slice(0, 5), w);
    check(`${w}px: nothing pokes out of the screen`, out.length === 0, out.join(" "));
    if (h >= 800 || w <= 390) {
      const cta = await p.locator(".hero__call").boundingBox();
      check(`${w}px: call button inside the first screen`, !!cta && cta.y + cta.height <= h, cta ? `bottom ${Math.round(cta.y + cta.height)}` : "");
    }
    await ctx.close();
  }

  // 3. Phone: menu, brands, floating call
  {
    const { p, ctx } = await page({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    check("390: header ≤ 64px", ((await p.locator(".site-header").boundingBox())?.height ?? 99) <= 64);
    check("390: header call button is tel:", (await p.locator(".site-header__call").getAttribute("href")) === "tel:0800210982");
    await p.click(".mnav__toggle");
    check("390: menu opens with 6 anchors and 6 phones", (await p.locator(".mnav__links a:visible").count()) === 6 && (await p.locator(".mnav__phones a:visible").count()) === 6);
    await p.click('.mnav__links a[href="#contacts"]');
    await p.waitForTimeout(900);
    check("390: anchor closes the menu", !(await p.$eval(".mnav", (d) => d.open)));
    check("390: floating call shown after the hero", await p.$eval(".float-call", (b) => b.classList.contains("is-shown")));
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(400);
    check("390: floating call hidden on the first screen", !(await p.$eval(".float-call", (b) => b.classList.contains("is-shown"))));
    const visibleBrands = async () => p.$$eval("#brands-list li", (l) => l.filter((x) => getComputedStyle(x).display !== "none").length);
    check("390: 12 brands before expanding", (await visibleBrands()) === 12);
    await p.click("[data-brands-toggle]");
    check("390: all 49 brands after expanding", (await visibleBrands()) === 49 && (await p.getAttribute("[data-brands-toggle]", "aria-expanded")) === "true");
    await ctx.close();
  }

  // 4. Without scripts and with reduced motion: everything readable
  {
    const { p, ctx } = await page({ javaScriptEnabled: false });
    const hidden = await p.$$eval(".how__step, .hero__fork, .picker__panel", (els) => els.filter((e) => getComputedStyle(e).opacity === "0" || getComputedStyle(e).display === "none").length);
    check("no JS: fork steps and all finder panels visible", hidden === 0);
    check("no JS: 49 brands listed", (await p.locator("#brands-list li").count()) === 49);
    await ctx.close();
  }
  {
    const { p, ctx } = await page({ reducedMotion: "reduce" });
    const op = await p.$$eval(".how__step", (els) => els.map((e) => getComputedStyle(e).opacity));
    check("reduced motion: fork steps visible at once", op.every((o) => o === "1"));
    const tr = await p.$eval(".fork__cover", (e) => getComputedStyle(e).transform);
    check("reduced motion: hero fork drawn without animation", tr !== "none" && !tr.startsWith("matrix(1, 0, 0, 1, 0,"), tr);
    await ctx.close();
  }
} finally {
  await browser.close();
}
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
