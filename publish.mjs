import fs from 'fs'
const dir = './dist/Blade'

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
}

fs.copyFileSync('./dist/blade.lua', './dist/Blade/blade.lua')
fs.copyFileSync('./Blade.toc', './dist/Blade/Blade.toc')
