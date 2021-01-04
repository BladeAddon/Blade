local ns, BLADE = ...
BLADE.commands = {}

SLASH_BLADE1 = "/blade"
SLASH_BLADE2 = "/bla"
SLASH_BLADE3 = "/bl"
SlashCmdList["BLADE"] = function(msg)
    local cmd, param, param2 = msg:match("^([%w%-]+)%s*([^%s]*)%s*(.*)$")

    cmd = cmd or ""
    param = param or ""
    param2 = param2 or ""

    local matchingCommand = false

    for k, v in pairs(BLADE.commands) do
        if cmd == k then
            matchingCommand = true
            for i = 1, #v do
                v[i](param, param2)
            end
        end
    end

    if not matchingCommand then
        BLADE:Print("No matching command found for: '" .. cmd .. "'")
    end
end

function BLADE:RegisterCommand(command, handler)
    if not self.commands[command] then
        self.commands[command] = {}
    end

    table.insert(self.commands[command], handler)
end
