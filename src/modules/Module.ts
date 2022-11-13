import { ConfigService } from '../ConfigService'
import { Options, OptionsMenu } from '../options'
import { Inject } from '../tstl-di/src/Inject'

export abstract class Module {
    @Inject("Options") protected readonly _options!: Options
    @Inject("SettingsService") private readonly _settings!: ConfigService
    public readonly name: string
    protected readonly _moduleSettings: ConfigService
    protected readonly _menu: OptionsMenu
    protected _loaded = false

    protected constructor(name: string) {
        this.name = name
        this._moduleSettings = this._settings.GetConfig(name)

        this._menu = this._options.AddMenu(this.name, this.name)
        this._menu.AddToggle("ENABLED", "Enabled").desc = `Enables module "${this.name}". If disabled it will not load and needs a reload after enabling.`
    }

    ShouldLoad(): boolean {
        return this._moduleSettings.Get<boolean>("ENABLED") === true
    }

    protected abstract OnLoad(): void

    public get isLoaded(): boolean {
        return this._loaded
    }

    public Load(): void {
        print("Loading module", this.name)

        this.OnLoad()
        this._loaded = true
    }
}