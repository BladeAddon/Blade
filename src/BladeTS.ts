import { Inject } from './tstl-di/src/Inject'
import * as Bootstrapper from "./bootstrapper"
import { container } from './tstl-di/src/Container'
import { ConfigService } from './ConfigService'
import { Options } from './options'
import { AutoVendor } from './modules/AutoVendor'
import { Module } from './modules/Module'
import { BladeFrame } from './BladeFrame'

Bootstrapper.Load()

export class BladeTS {
    @Inject("DB") data!: LuaTable<string, any>
    @Inject("Settings") settings!: LuaTable<string, any>
}

const bladeFrame = new BladeFrame()
container.instance("BladeFrame", bladeFrame)
bladeFrame.RegisterEvent("ADDON_LOADED", (addon: string) => {
    if (addon === "BladeTS") {
        container.instance("DB", BLADETSDATA)
        container.instance("Settings", BLADETSDATA.get("Settings"))

        const blade = new BladeTS()

        const settingsService = new ConfigService(blade.settings)
        container.instance("SettingsService", settingsService)
        const options = new Options("BladeTS")
        container.instance("Options", options)

        const modules: Module[] = [new AutoVendor()]
        for (const module of modules) {
            if (module.ShouldLoad()) {
                print("Loading module", module.name)
                module.OnLoad()
            }
        }

        LibStub<IAceConfig>("AceConfig-3.0").RegisterOptionsTable("BladeTS", options.get())
        LibStub<IAceConfigDialog>("AceConfigDialog-3.0").AddToBlizOptions("BladeTS", "BladeTS")
        print("BladeTS loaded")
    }
})
