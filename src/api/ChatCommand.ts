export class ChatCommand {
    constructor(public readonly command: string, public readonly description: string, public readonly handler: (...args: string[]) => void) {
    }
}
