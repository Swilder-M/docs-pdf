const child_process = require('child_process')
const Jimp = require('jimp')
const fs = require('fs')
const path = require('path')

async function generateCover(version = 'v4.2.2', isEE = true) {
  const fileName = isEE ? 'cover-emqx-ee.jpg' : 'cover-emqx-ce.jpg'
  const versionName = isEE ? `EMQ X Enterprise ${version}` : `EMQ X Broker ${version}`
  const file = path.join(__dirname, fileName)
  const img = await Jimp.read(file)
  // 1145 * 872
  const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK)
  img.print(font, img.bitmap.width * 0.05, img.bitmap.height - 40, versionName)
  const writeFileName = path.join(__dirname, 'cover.jpg')
  await img.writeAsync(writeFileName)
  return {
    versionName,
    fileName,
    file
  }
}

async function main() {
  child_process.execSync(`rm -rf ./x-* zh_CN `)
  child_process.execSync(`node init.js`)
  const info = await generateCover(process.argv[2])
  console.log(info)
  const versionName = info.versionName.replace(/\s\b/gim, '_')
  child_process.execSync(`gitbook pdf`, {stdio:[0,1,2]})
  child_process.execSync(`mv book.pdf ${versionName}.pdf`)
}
main()