const {execSync} = require('child_process')
const path = require('path')
const fs = require('fs')

async function main() {
  console.log('移动')
  const source = path.join(__dirname, '../emqx-docs/zh_CN')
  const target = path.join(__dirname)
  execSync(`cp -r ${source} ${target}`)
  console.log('移动成功')
  fs.copyFileSync(
    path.join(__dirname, '../emqx-docs/directory_ee.json'),
    './directory.json'
  )
  getMd()
}

main()

function getMd() {
  console.log('开始生成目录')
  const toc = require('./directory.json').cn
  const md = ['# Summary']
  toc.forEach((item, i) => {
    if (item.children) {
      let mdContent = `# ${item.title}\n\n`
      md.push(`* [${item.title}](x-${i}.md)`)
      item.children.forEach((item2, j) => {
        if (!item2.children || item2.children.length === 0) {
          md.push(` * [${item2.title}](./zh_CN/${item2.path}.md)`)
          mdContent += `- [${item2.title}](./zh_CN/${item2.path}.md)\n`
        } else {
          md.push(`* [${item.title}-${item2.title}](x-${i}-${j}.md)`)
          mdContent += `### ${item.title}-${item2.title}\n\n`
          let mdContentChild = `# ${item.title}-${item2.title}\n\n`
          item2.children.forEach((item3) => {
            md.push(` * [${item3.title}](./zh_CN/${item3.path}.md)`)
            mdContent += `- [${item3.title}](./zh_CN/${item3.path}.md)\n`
            mdContentChild += `- [${item3.title}](./zh_CN/${item3.path}.md)\n`
          })
          fs.writeFileSync(`x-${i}-${j}.md`, mdContentChild)
        }
      })
      fs.writeFileSync(`x-${i}.md`, mdContent)
    } else {
      md.push(`* [${item.title}](./zh_CN/${item.path}.md)`)
      // mdContent = fs.readFileSync(
      //   path.join(__dirname, 'zh_CN', `${item.path}.md`)
      // )
    }
  })
  fs.writeFileSync('SUMMARY_auto.md', md.join('\n'))
  fs.writeFileSync('SUMMARY.md', md.join('\n'))
  console.log('done')
}