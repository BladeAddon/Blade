declare interface IBootstrapper {
    Load(): void
    setOnCommand(handler: (cmd: string, ...params: string[]) => void): void
}

declare const Bootstrapper: IBootstrapper
export = Bootstrapper
