import { Inject } from '../tstl-di/src/Inject'
import { AddonInfo } from './AddonInfo'
import { ColorHelper } from './ColorHelper'
import { ILocalization } from './ILocalization'
import { IOutput } from './IOutput'

export class Output implements IOutput {
    @Inject("AddonInfo") private readonly _addonInfo!: AddonInfo
    @Inject("ILocalization") protected readonly _localization!: ILocalization

    private getPrintPrefix(): string {
        return ColorHelper.Encode("[", ColorHelper.WHITE) + ColorHelper.Encode(this._addonInfo.AddonName, this._addonInfo.AddonColor) + ColorHelper.Encode("]", ColorHelper.WHITE)
    }

    public Print(...args: any[]): void {
        print(this.getPrintPrefix(), ...args)
    }

    public LocalizedPrint(key: string, ...args: any[]): void {
        this.Print(this._localization.Format(key, ...args))
    }
}
