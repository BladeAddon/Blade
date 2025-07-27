local input: {string, Addon} = {...}
local ns = input[1]
local addon = input[2]

local command_handler: CommandHandler = {
    commands = {},
}

function command_handler:register_command(command: ChatCommand)
    assert(command and command.command and command.description and command.handler, "Invalid command registration")
    assert(not self.commands[command.command], "Command already exists: " .. command.command)

    self.commands[command.command] = {
        command = command.command,
        description = command.description,
        handler = command.handler,
    }
end

function command_handler:display_help()
    print("Available commands:")
    for cmd, command in pairs(self.commands) do
        print(command.command, command.description)
    end
end

function command_handler:on_chat_command(message: string, edit_box: any)
    local command, params = string.match(message, "^(%S*)%s*(.-)$")
    if not command or command == "" or not self.commands[command] then
        self:display_help()
        return
    end

    self.commands[command].handler(params)
end

global SLASH_Blade1, SLASH_Blade2, SLASH_Blade3 = "/blade", "/bla", "/bl"

SlashCmdList[ns] = function(message: string, edit_box: any)
    command_handler:on_chat_command(message, edit_box)
end

addon.command_handler = command_handler
