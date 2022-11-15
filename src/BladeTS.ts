import { Inject } from './tstl-di/src/Inject'
import * as Bootstrapper from "./bootstrapper"
import { container } from './tstl-di/src/Container'
import { ConfigService } from './ConfigService'
import { Options } from './options'
import { AutoVendor } from './modules/AutoVendor'
import { Module } from './modules/Module'
import { EventHandler } from './api/EventHandler'
import { IEventHandler } from './api/IEventHandler'

Bootstrapper.Load()

export class BladeTS {
    @Inject("DB") data!: LuaTable<string, any>
    @Inject("Settings") settings!: LuaTable<string, any>
}

const eventHandler: IEventHandler = new EventHandler()
container.instance("IEventHandler", new EventHandler())
eventHandler.RegisterEvent("ADDON_LOADED", (addon: string) => {
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
                module.Load()
            }
        }

        LibStub<IAceConfig>("AceConfig-3.0").RegisterOptionsTable("BladeTS", options.get())
        LibStub<IAceConfigDialog>("AceConfigDialog-3.0").AddToBlizOptions("BladeTS", "BladeTS")
        print("BladeTS loaded")
    }
})
