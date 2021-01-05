local ns, Blade = ...
Blade.commands = {}

local function ChatCommand(name, description, handler)
    return {Name = name, Description = description, Handler = handler}
end

local function DisplayHelp()
    for commandName, commands in pairs(Blade.commands) do
        for _, command in ipairs(commands) do
            Blade:Print(commandName, command.Description and command.Description or "")
        end
    end
end

SLASH_Blade1 = "/blade"
SLASH_Blade2 = "/bla"
SLASH_Blade3 = "/bl"
SlashCmdList["Blade"] = function(msg)
    local cmd, params = msg:match("^(%S*)%s*(.-)$")

    if not cmd or cmd == "" then
        DisplayHelp()
        return
    end

    cmd = cmd or ""
    params = params or ""

    if Blade.commands[cmd] then
        local v = Blade.commands[cmd]
        for i = 1, #v do
            v[i].Handler(params)
        end
    else
        Blade:Print("No matching command found for: '" .. cmd .. "'")
    end
end

function Blade:RegisterCommand(command, handler, description)
    if not self.commands[command] then
        self.commands[command] = {}
    end

    table.insert(self.commands[command], ChatCommand(command, description, handler))
end
