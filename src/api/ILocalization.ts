export interface ILocalization {
    Get(key: string): string
    Format(key: string, ...args: any[]): string
}
