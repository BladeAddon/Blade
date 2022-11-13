interface IBootstrapper {
    Load(): void
}

declare const Bootstrapper: IBootstrapper
declare const BLADETSDATA: LuaTable<string, any>
export = Bootstrapper
