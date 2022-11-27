import * as fs from "https://deno.land/std@0.163.0/fs/mod.ts"
import * as path from "https://deno.land/std@0.163.0/path/mod.ts"

const out_directory = "./out"
const out_directory_full = path.resolve(out_directory)
const addon_directory = "./addon"
const addon_directory_full = path.resolve(addon_directory)

for await (const entry of fs.walk(addon_directory_full)) {
    const file_path_full = path.resolve(entry.path)
    const relative_path = path.relative(addon_directory_full, file_path_full)
    const new_path = path.join(out_directory_full, relative_path)
    console.log(new_path)
    await fs.copy(file_path_full, new_path, { overwrite: true })
}
