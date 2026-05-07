import { existsSync, mkdirSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'
import { PNG } from 'pngjs'

const baseUrl = process.env.VISUAL_CHECK_URL || 'http://127.0.0.1:5173'
const outputDir = 'artifacts'
const targets = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, isMobile: false, expectsBottomNav: false, minHeight: 560 },
  { name: 'tablet', viewport: { width: 820, height: 1180 }, isMobile: true, expectsBottomNav: false, minHeight: 560 },
  { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true, expectsBottomNav: true, minHeight: 470 },
]

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true })
}

const samplePng = (buffer) => {
  const png = PNG.sync.read(buffer)
  const unique = new Set()
  let brightSamples = 0
  let samples = 0
  const stepX = Math.max(1, Math.floor(png.width / 24))
  const stepY = Math.max(1, Math.floor(png.height / 24))

  for (let x = 0; x < png.width; x += stepX) {
    for (let y = 0; y < png.height; y += stepY) {
      const index = (png.width * y + x) << 2
      const r = png.data[index]
      const g = png.data[index + 1]
      const b = png.data[index + 2]
      unique.add(`${r},${g},${b}`)
      if (r + g + b > 30) brightSamples += 1
      samples += 1
    }
  }

  return {
    width: png.width,
    height: png.height,
    samples,
    brightSamples,
    uniqueColors: unique.size,
  }
}

const browser = await chromium.launch({ headless: true })
const results = []

for (const target of targets) {
  const context = await browser.newContext({
    viewport: target.viewport,
    deviceScaleFactor: target.isMobile ? 2 : 1,
    isMobile: target.isMobile,
  })
  const page = await context.newPage()
  const browserErrors = []

  page.on('pageerror', (error) => browserErrors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') browserErrors.push(message.text())
  })

  await page.goto(`${baseUrl}?visualCheck=${Date.now()}`, { waitUntil: 'networkidle' })
  await page.waitForSelector('.atlas-image-wrap', { timeout: 15000 })
  await page.waitForSelector('.atlas-hotspot', { timeout: 15000 })
  await page.waitForFunction(() => {
    const image = document.querySelector('.atlas-image')
    return image && image.complete && image.naturalWidth > 0
  }, { timeout: 15000 })

  if (target.expectsBottomNav) {
    await page.locator('.atlas-hotspot').first().click()
    await page.waitForSelector('.bs-panel .info-card', { timeout: 5000 })
  }

  await page.screenshot({ path: `${outputDir}/vet3d-${target.name}.png`, fullPage: true })
  const viewerBuffer = await page.locator('.atlas-image-wrap').screenshot()
  await writeFile(`${outputDir}/vet3d-${target.name}-viewer.png`, viewerBuffer)

  const domReport = await page.evaluate((options) => {
    const viewer = document.querySelector('.atlas-image-wrap')
    const rect = viewer.getBoundingClientRect()
    const root = document.documentElement
    const mobileNav = document.querySelector('.mobile-nav')

    return {
      cssWidth: Math.round(rect.width),
      cssHeight: Math.round(rect.height),
      hotspotCount: document.querySelectorAll('.atlas-hotspot').length,
      hasInfoCard: Boolean(document.querySelector(options.expectsBottomNav ? '.bs-panel .info-card' : '.detail-rail .info-card')),
      hasExpectedBottomNav: options.expectsBottomNav ? getComputedStyle(mobileNav).display !== 'none' : true,
      horizontalOverflow: root.scrollWidth > root.clientWidth + 2,
    }
  }, { isMobile: target.isMobile, expectsBottomNav: target.expectsBottomNav })

  const pixelReport = samplePng(viewerBuffer)
  results.push({ target: target.name, browserErrors, domReport, pixelReport, minHeight: target.minHeight })
  await context.close()
}

await browser.close()

console.log(JSON.stringify(results, null, 2))

const failed = results.some(
  (entry) =>
    entry.browserErrors.length ||
    entry.domReport.cssHeight < entry.minHeight ||
    entry.domReport.hotspotCount < 10 ||
    !entry.domReport.hasInfoCard ||
    !entry.domReport.hasExpectedBottomNav ||
    entry.domReport.horizontalOverflow ||
    entry.pixelReport.brightSamples < 8 ||
    entry.pixelReport.uniqueColors < 8,
)

if (failed) {
  process.exit(1)
}
