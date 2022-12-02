import { ActionBarSaver } from './modules/ActionBarSaver'
import { AutoCompleteSLMissions } from './modules/AutoCompleteSLMissions'
import { AutoKeyInserter } from './modules/AutoKeyInserter'
import { AutoRepair } from './modules/AutoRepair'
import { AutoVendor } from './modules/AutoVendor'
import { Module } from './modules/Module'
import { TooltipInfo } from './modules/TooltipInfo'

export class ModuleLoader {
    private readonly _loadedModules: Module[] = []

    private _modules: Module[] = [];

    private instance(module: Module): void {
        this._modules.push(module)
    }

    private singleton(moduleType: { new(): Module }): void {
        this.instance(new moduleType())
    }

    public RegisterModule(moduleType: { new(): Module }): void {
        this.singleton(moduleType)
    }

    public Init(): void {
        this.RegisterModule(AutoVendor)
        this.RegisterModule(AutoRepair)
        this.RegisterModule(AutoKeyInserter)
        this.RegisterModule(AutoCompleteSLMissions)
        this.RegisterModule(ActionBarSaver)
        this.RegisterModule(TooltipInfo)
    }

    public Load(): void {
        for (const module of this._modules) {
            if (module.ShouldLoad()) {
                this._loadedModules.push(module)
                module.Load()
            }
        }
    }
}
