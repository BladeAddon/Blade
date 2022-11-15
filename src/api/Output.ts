import { Inject } from '../tstl-di/src/Inject'
import { AddonInfo } from './AddonInfo'
import { ColorHelper } from './ColorHelper'
import { IOutput } from './IOutput'

export class Output implements IOutput {
    @Inject("AddonInfo") private readonly _addonInfo!: AddonInfo
    private encodeInColor(str: string, color: string): string {
        return color + str + ColorHelper.RETURN_COLOR
    }

    private getPrintPrefix(): string {
        return this.encodeInColor("[", ColorHelper.WHITE) + this.encodeInColor(this._addonInfo.AddonName, this._addonInfo.AddonColor) + this.encodeInColor("]", ColorHelper.WHITE)
    }

    public Print(...args: any[]): void {
        print(this.getPrintPrefix(), ...args)
    }
}
