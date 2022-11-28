import * as fs from "https://deno.land/std@0.163.0/fs/mod.ts"
import * as path from "https://deno.land/std@0.163.0/path/mod.ts"

console.log(`running on ${Deno.build.os}`)

const out_directory = "./out"
const out_directory_full = path.resolve(out_directory)

const tasks: Promise<void>[] = []

async function minify(path: string): Promise<void> {
    console.log(`minifying ${path}`)
    if (Deno.build.os === "windows") {
        const output = await Deno.run({ cmd: ["cmd", "/c", "npx", "luamin", "-f", path], stdout: "piped" }).output()
        const outStr = new TextDecoder().decode(output)
        await Deno.writeTextFile(path, outStr)
    } else if (Deno.build.os === "linux") {
        const output = await Deno.run({ cmd: ["bash", "-c", "npx", "luamin", "-f", path] }).output()
        const outStr = new TextDecoder().decode(output)
        await Deno.writeTextFile(path, outStr)
    }
}

for await (const entry of fs.walk(out_directory_full, { exts: [".lua"] })) {
    const file_path_full = path.resolve(entry.path)
    tasks.push(minify(file_path_full))
}

await Promise.all(tasks)
