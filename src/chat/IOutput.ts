export interface IOutput {
    Print(...args: any[]): void
    LocalizedPrint(key: string, ...args: any[]): void
}
