import { ILocalization } from '../../localization/ILocalization'
import { IOutput } from '../../chat/IOutput'
import { ConfigService } from '../../ConfigService'
import { Options, OptionsMenu } from '../../options'
import { Inject } from '../../tstl-di/src/Inject'

export abstract class Module {
    @Inject("SettingsService") private readonly _settings!: ConfigService

    @Inject("Options") protected readonly _options!: Options
    @Inject("IOutput") protected readonly _output!: IOutput
    @Inject("ILocalization") protected readonly _localization!: ILocalization

    protected readonly _moduleSettings: ConfigService
    protected readonly _db: ConfigService
    protected readonly _menu: OptionsMenu
    protected _loaded = false

    protected constructor(public readonly key: string, public readonly name: string, public readonly description?: string) {
        this._moduleSettings = this._settings.GetConfig(key)
        this._db = this._moduleSettings
        this._menu = this._options.AddMenu(this.key, this.name)
        if (this.description) {
            this._menu.setDescription(this.description)
        }
        this._menu.AddHeader(key, name).order = 0
        this._menu.AddToggle("ENABLED", this._localization.Get("ENABLED")).desc = this._localization.Format("MODULE_ENABLE_DESCRIPTION", this.name)
    }

    ShouldLoad(): boolean {
        return this._moduleSettings.Get<boolean>("ENABLED") === true
    }

    protected abstract OnLoad(): void

    public get isLoaded(): boolean {
        return this._loaded
    }

    public Load(): void {
        this._output.LocalizedPrint("LOADING_MODULE", this.name)

        this.OnLoad()
        this._loaded = true
    }
}