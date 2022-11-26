import { Inject } from './tstl-di/src/Inject'
import * as Bootstrapper from "./bootstrapper"
import { container } from './tstl-di/src/Container'
import { ConfigService } from './ConfigService'
import { Options } from './options'
import { EventHandler } from './api/EventHandler'
import { IEventHandler } from './api/IEventHandler'
import { AddonInfo } from './api/AddonInfo'
import { ColorHelper } from './api/ColorHelper'
import { Output } from './api/Output'
import { IOutput } from './api/IOutput'
import { CommandHandler } from './api/CommandHandler'
import { Bag } from './api/Bag'
import { Localization } from './api/Localization'
import { ModuleLoader } from './ModuleLoader'
import { Items } from './api/Items'

Bootstrapper.Load()

export class Blade {
    @Inject("DB") data!: LuaTable<string, unknown>
    @Inject("Settings") settings!: LuaTable
}

const addonInfo = new AddonInfo("Blade", ColorHelper.DEEP_PINK)
container.instance("AddonInfo", addonInfo)
const localization = new Localization()
container.instance("ILocalization", localization)
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
        const options = new Options(addonInfo.AddonName, addonInfo.AddonName)
        container.instance("Options", options)
        container.instance("CommandHandler", new CommandHandler())
        container.singleton("Items", Items)
        const bag = new Bag()
        container.instance("Bag", bag)

        bag.Load()

        const moduleLoader = new ModuleLoader()
        container.instance("ModuleLoader", moduleLoader)
        moduleLoader.Load()

        LibStub<IAceConfig>("AceConfig-3.0").RegisterOptionsTable(addonInfo.AddonName, options.get())
        LibStub<IAceConfigDialog>("AceConfigDialog-3.0").AddToBlizOptions(addonInfo.AddonName, addonInfo.AddonName)
        output.LocalizedPrint("LOADED", addonInfo.AddonName)
    }
})
