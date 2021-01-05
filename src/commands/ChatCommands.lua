local ns, Blade = ...
Blade.commands = {}

SLASH_Blade1 = "/blade"
SLASH_Blade2 = "/bla"
SLASH_Blade3 = "/bl"
SlashCmdList["Blade"] = function(msg)
    local cmd, param, param2 = msg:match("^([%w%-]+)%s*([^%s]*)%s*(.*)$")

    cmd = cmd or ""
    param = param or ""
    param2 = param2 or ""

    local matchingCommand = false

    for k, v in pairs(Blade.commands) do
        if cmd == k then
            matchingCommand = true
            for i = 1, #v do
                v[i](param, param2)
            end
        end
    end

    if not matchingCommand then
        Blade:Print("No matching command found for: '" .. cmd .. "'")
    end
end

function Blade:RegisterCommand(command, handler)
    if not self.commands[command] then
        self.commands[command] = {}
    end

    table.insert(self.commands[command], handler)
end
