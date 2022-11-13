import { Inject } from './tstl-di/src/Inject'
import * as Bootstrapper from "./bootstrapper"
import { container } from './tstl-di/src/Container'
import { ConfigService } from './ConfigService'

Bootstrapper.Load()

export class BladeTS {
    @Inject("DB") data!: LuaTable<string, any>
    @Inject("Settings") settings!: LuaTable<string, any>
}

container.instance("DB", BLADETSDATA)
container.instance("Settings", BLADETSDATA.get("Settings"))

const blade = new BladeTS()

container.instance("SettingsService", new ConfigService(blade.settings))
