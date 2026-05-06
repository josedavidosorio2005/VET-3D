import { existsSync, mkdirSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'
import { PNG } from 'pngjs'

const baseUrl = process.env.VISUAL_CHECK_URL || 'http://127.0.0.1:5173'
const outputDir = 'artifacts'
const targets = [
  { name: 'desktop', viewport: { width: 1366, height: 768 }, isMobile: false, minHeight: 420 },
  { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true, minHeight: 360 },
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
  await page.waitForSelector('canvas', { timeout: 15000 })
  await page.waitForTimeout(1800)

  await page.screenshot({ path: `${outputDir}/vet3d-${target.name}.png`, fullPage: true })
  const canvasBuffer = await page.locator('canvas').screenshot()
  await writeFile(`${outputDir}/vet3d-${target.name}-canvas.png`, canvasBuffer)

  const domReport = await page.evaluate(() => {
    const canvas = document.querySelector('canvas')
    const rect = canvas.getBoundingClientRect()

    return {
      cssWidth: Math.round(rect.width),
      cssHeight: Math.round(rect.height),
      hotspotCount: document.querySelectorAll('.hotspot').length,
      hasInfoCard: Boolean(document.querySelector('.info-card')),
    }
  })

  const pixelReport = samplePng(canvasBuffer)
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
    entry.pixelReport.brightSamples < 8 ||
    entry.pixelReport.uniqueColors < 8,
)

if (failed) {
  process.exit(1)
}
