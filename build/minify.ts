import * as fs from "https://deno.land/std@0.163.0/fs/mod.ts"
import * as path from "https://deno.land/std@0.163.0/path/mod.ts"

const addon_name = "Blade"
const out_directory = "./out"
const out_directory_full = path.resolve(out_directory)
const out_path = path.join(out_directory_full, `${addon_name}.lua`)
const min_path = path.join(out_directory_full, `${addon_name}.min.lua`)

if (Deno.build.os === "windows") {
    await Deno.run({ cmd: ["cmd", "/c", `npx luamin -f ${out_path} > ${min_path}`] }).status()
} else if (Deno.build.os === "linux") {
    await Deno.run({ cmd: ["bash", "-c", `npx luamin -f ${out_path} > ${min_path}`] }).status()
}

await fs.move(min_path, out_path, { overwrite: true })
