import { Inject } from '../tstl-di/src/Inject'
import { AddonInfo } from '../AddonInfo'
import { ColorHelper } from '../color/ColorHelper'
import { ILocalization } from '../localization/ILocalization'
import { IOutput } from './IOutput'

export class Output implements IOutput {
    @Inject("AddonInfo") private readonly _addonInfo!: AddonInfo
    @Inject("ILocalization") protected readonly _localization!: ILocalization

    private _printPrefix?: string

    private get printPrefix(): string {
        return this._printPrefix ??= ColorHelper.Encode("[", ColorHelper.WHITE) + ColorHelper.Encode(this._addonInfo.AddonName, this._addonInfo.AddonColor) + ColorHelper.Encode("]", ColorHelper.WHITE)
    }

    public Print(...args: any[]): void {
        print(this.printPrefix, ...args)
    }

    public LocalizedPrint(key: string, ...args: any[]): void {
        this.Print(this._localization.Format(key, ...args))
    }
}
