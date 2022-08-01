import fs from 'fs'
const addonName = 'Blade'
const dir = `./dist/${addonName}/`

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
}

fs.copyFileSync(`./dist/${addonName}.lua`, `./dist/${addonName}/${addonName}.lua`)
fs.copyFileSync(`./${addonName}.toc`, `./dist/${addonName}/${addonName}.toc`)
