import { ChatCommand } from './ChatCommand'
import { IOutput } from '../IOutput'
import { Inject } from '../../tstl-di/src/Inject'

export class CommandHandler {
    @Inject("IOutput") protected readonly _output!: IOutput

    private readonly _commands: Map<string, ChatCommand[]> = new Map()

    constructor() {
        SLASH_Blade1 = "/blade"
        SLASH_Blade2 = "/bla"
        SLASH_Blade3 = "/bl"

        // weird setup necessary for tstl interop and this/self handling
        const onChatCmd = this.onChatCmd.bind(this)

        // callback expects msg: string as first parameter so we cannot have a this
        function chatCmdWrapper(this: void, msg: string): void {
            onChatCmd(msg)
        }

        SlashCmdList.set("Blade", chatCmdWrapper)
    }

    private displayHelp(): void {
        for (const [commandName, commands] of this._commands) {
            for (const command of commands) {
                this._output.Print(commandName, command.description)
            }
        }
    }

    private onChatCmd(msg: string): void {
        const [cmd, ...params] = string.match(msg, "^(%S*)%s*(.-)$")
        this.onCommand(cmd, ...params)
    }

    private onCommand(cmd: string | undefined, ...params: string[]): void {
        if (!cmd || cmd === "" || !this._commands.has(cmd)) {
            this.displayHelp()
            return
        }

        const commands = this._commands.get(cmd)!
        for (const command of commands) {
            command.handler(...params)
        }
    }

    public RegisterCommand(command: ChatCommand): void {
        if (!this._commands.has(command.command)) {
            this._commands.set(command.command, [])
        }

        this._commands.get(command.command)!.push(command)
    }
}
