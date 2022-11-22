export abstract class Loadable {
    protected _loaded = false

    protected abstract OnLoad(): void

    public get isLoaded(): boolean {
        return this._loaded
    }

    public Load(): void {
        this.OnLoad()
        this._loaded = true
    }
}
