interface IBootstrapper {
    Load(): void
}

declare const Bootstrapper: IBootstrapper
export = Bootstrapper
