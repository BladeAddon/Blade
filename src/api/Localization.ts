import { Inject } from '../tstl-di/src/Inject'
import { AddonInfo } from './AddonInfo'
import { ILocalization } from './ILocalization'

export class Localization implements ILocalization {
    @Inject("AddonInfo") private readonly _addonInfo!: AddonInfo

    private readonly _locale: LuaTable<string, string>

    constructor() {
        this._locale = LibStub<IAceLocale>("AceLocale-3.0").GetLocale(this._addonInfo.AddonName)
    }

    Get(key: string): string {
        return this._locale.get(key) ?? key
    }

    Format(key: string, ...args: any[]): string {
        return string.format(this.Get(key), ...args)
    }
}
