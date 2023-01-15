import { AddonInfo } from './AddonInfo'
import * as Bootstrapper from './bootstrapper'
import { CommandHandler } from './chat/command/CommandHandler'
import { IOutput } from './chat/IOutput'
import { Output } from './chat/Output'
import { ColorHelper } from './color/ColorHelper'
import { ConfigService } from './ConfigService'
import { EventHandler } from './event/EventHandler'
import { IEventHandler } from './event/IEventHandler'
import { Items } from './item/Items'
import { Loader } from './loadable/Loader'
import { ModuleLoader } from './loadable/ModuleLoader'
import { Localization } from './localization/Localization'
import { Options } from './options'
import { container } from './tstl-di/src/Container'
import { Inject } from './tstl-di/src/Inject'

Bootstrapper.Load()

export class Blade {
    @Inject("DB") data!: LuaTable<string, unknown>
    @Inject("Settings") settings!: LuaTable
}

const addonInfo = new AddonInfo("Blade", ColorHelper.DEEP_PINK)
container.instance("AddonInfo", addonInfo)
container.singleton("ILocalization", Localization)
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
        container.singleton("CommandHandler", CommandHandler)
        container.singleton("Items", Items)
        container.singleton("ModuleLoader", ModuleLoader)

        eventHandler.RegisterEvent("PLAYER_ENTERING_WORLD", (isInitialLogin: boolean, isReloadingUi: boolean) => {
            if (!isInitialLogin && !isReloadingUi) {
                return
            }

            const loader = new Loader()
            loader.Init()
            loader.Load()

            LibStub<IAceConfig>("AceConfig-3.0").RegisterOptionsTable(addonInfo.AddonName, options.get())
            LibStub<IAceConfigDialog>("AceConfigDialog-3.0").AddToBlizOptions(addonInfo.AddonName, addonInfo.AddonName)
            output.LocalizedPrint("LOADED", addonInfo.AddonName)
        })
    }
})
