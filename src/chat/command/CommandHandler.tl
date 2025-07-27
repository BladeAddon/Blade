local input: {string, {any:any}} = {...}
local ns = input[1]
print("CommandHandler: ",  ns)
local addon = input[2]

local command_handler: CommandHandler = {
    commands = {},
}
function command_handler:display_help()
    print("Available commands:")
    for cmd, command in pairs(self.commands) do
        print(command.command, command.description)
    end
end

function command_handler:on_chat_command(message: string, edit_box: any)
    -- if self.commands[name] then
    --     self.commands[name](name, args)
    -- else
    --     print("Command not found: " .. name)
    -- end

    local command, params = string.match(message, "^(%S*)%s*(.-)$")
    if not command or command == "" or not self.commands[command] then
        self:display_help()
        return
    end
end

global SLASH_Blade1, SLASH_Blade2, SLASH_Blade3 = "/blade", "/bla", "/bl"

SlashCmdList[ns] = function(message: string, edit_box: any)
    command_handler:on_chat_command(message, edit_box)
end

addon.command_handler = command_handler
