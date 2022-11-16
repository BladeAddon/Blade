import { Inject } from './tstl-di/src/Inject'
import * as Bootstrapper from "./bootstrapper"
import { container } from './tstl-di/src/Container'
import { ConfigService } from './ConfigService'
import { Options } from './options'
import { AutoVendor } from './modules/AutoVendor'
import { Module } from './modules/Module'
import { EventHandler } from './api/EventHandler'
import { IEventHandler } from './api/IEventHandler'
import { AutoRepair } from './modules/AutoRepair'
import { AddonInfo } from './api/AddonInfo'
import { ColorHelper } from './api/ColorHelper'
import { Output } from './api/Output'
import { IOutput } from './api/IOutput'
import { AutoKeyInserter } from './modules/AutoKeyInserter'
import { CommandHandler } from './api/CommandHandler'

Bootstrapper.Load()

export class Blade {
    @Inject("DB") data!: LuaTable<string, any>
    @Inject("Settings") settings!: LuaTable
}

const addonInfo = new AddonInfo("Blade", ColorHelper.DEEP_PINK)
container.instance("AddonInfo", addonInfo)
const output: IOutput = new Output()
container.instance("IOutput", output)

const eventHandler: IEventHandler = new EventHandler()
container.instance("IEventHandler", new EventHandler())
eventHandler.RegisterEvent("ADDON_LOADED", (addon: string) => {
    if (addon === addonInfo.AddonName) {
        container.instance("DB", BLADEDATA)
        container.instance("Settings", BLADEDATA.get("Settings"))

        const blade = new Blade()

        const settingsService = new ConfigService(blade.settings)
        container.instance("SettingsService", settingsService)
        const options = new Options(addonInfo.AddonName)
        container.instance("Options", options)
        container.instance("CommandHandler", new CommandHandler())

        const modules: Module[] = [new AutoVendor(), new AutoRepair(), new AutoKeyInserter()]
        for (const module of modules) {
            if (module.ShouldLoad()) {
                module.Load()
            }
        }

        LibStub<IAceConfig>("AceConfig-3.0").RegisterOptionsTable(addonInfo.AddonName, options.get())
        LibStub<IAceConfigDialog>("AceConfigDialog-3.0").AddToBlizOptions(addonInfo.AddonName, addonInfo.AddonName)
        output.Print("loaded")
    }
})
