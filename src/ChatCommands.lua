local ns, BLADE = ...
BLADE.commands = {}

SLASH_NOADDON1 = "/blade"
SLASH_NOADDON2 = "/bla"
SlashCmdList["BLADE"] = function(msg)
    local cmd, param, param2 = msg:match("^([%w%-]+)%s*([^%s]*)%s*(.*)$")

    cmd = cmd or ""
    param = param or ""
    param2 = param2 or ""

    for k, v in pairs(BLADE.commands) do
        if cmd == k then
            for i = 1, #v do
                v[i](param, param2)
            end
        end
    end
end

function BLADE:RegisterCommand(command, handler)
    if not self.commands[command] then
        self.commands[command] = {}
    end

    table.insert(self.commands[command], handler)
end
