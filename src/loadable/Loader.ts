import { Bag } from '../item/bag/Bag'
import { container } from '../tstl-di/src/Container'
import { Inject } from '../tstl-di/src/Inject'
import { Loadable } from './Loadable'
import { ModuleLoader } from './ModuleLoader'

export class Loader {
    @Inject("ModuleLoader") private readonly _moduleLoader!: ModuleLoader

    private _loadables: Loadable[] = [];

    private instance(loadable: Loadable): void {
        this._loadables.push(loadable)
        container.instance(loadable.name, loadable)
    }

    private singleton(loadableType: new () => Loadable): void {
        this.instance(new loadableType())
    }

    public RegisterLoadable(loadableType: new () => Loadable): void {
        this.singleton(loadableType)
    }

    public Init(): void {
        this.RegisterLoadable(Bag)

        this._moduleLoader.Init()
    }

    public Load(): void {
        for (const loadable of this._loadables) {
            loadable.Load()
        }

        this._moduleLoader.Load()
    }
}
