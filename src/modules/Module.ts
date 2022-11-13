import { ConfigService } from '../ConfigService'
import { Inject } from '../tstl-di/src/Inject'

export abstract class Module {
    public readonly name: string
    protected readonly _moduleSettings: ConfigService
    @Inject("SettingsService") private readonly _settings!: ConfigService

    protected constructor(name: string) {
        this.name = name
        this._moduleSettings = this._settings.GetConfig(name)
    }

    ShouldLoad(): boolean {
        return this._moduleSettings.Get<boolean>("ENABLED") === true
    }
}