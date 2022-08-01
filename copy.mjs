import fs from 'fs'
const wowAddonDir = process.env.WOWADDONS
const addonName = 'Blade'
const dir = `./dist/${addonName}`

if (wowAddonDir) {
    fs.cpSync(dir, `${wowAddonDir}/${addonName}`, { recursive: true })
}
