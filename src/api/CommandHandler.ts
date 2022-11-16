import { Inject } from '../tstl-di/src/Inject'
import { ChatCommand } from './ChatCommand'
import { IOutput } from './IOutput'
import * as Bootstrapper from "../bootstrapper"

export class CommandHandler {
    @Inject("IOutput") protected readonly _output!: IOutput

    private readonly _commands: Map<string, ChatCommand[]> = new Map()

    constructor() {
        // weird setup necessary for tstl interop and this/self handling
        Bootstrapper.setOnCommand(this.onCommand.bind(this))
    }

    private displayHelp(): void {
        for (const [commandName, commands] of this._commands) {
            for (const command of commands) {
                this._output.Print(commandName, command.description)
            }
        }
    }

    private onCommand(this: CommandHandler, cmd: string, ...params: string[]): void {
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
