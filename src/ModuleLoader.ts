import { ActionBarSaver } from './modules/ActionBarSaver'
import { AutoCompleteSLMissions } from './modules/AutoCompleteSLMissions'
import { AutoKeyInserter } from './modules/AutoKeyInserter'
import { AutoRepair } from './modules/AutoRepair'
import { AutoVendor } from './modules/AutoVendor'
import { Module } from './modules/Module'

export class ModuleLoader {
    private readonly _loadedModules: Module[] = []

    public Load(): void {
        for (const module of [new AutoVendor(), new AutoRepair(), new AutoKeyInserter(), new AutoCompleteSLMissions(), new ActionBarSaver()]) {
            if (module.ShouldLoad()) {
                this._loadedModules.push(module)
                module.Load()
            }
        }
    }
}
