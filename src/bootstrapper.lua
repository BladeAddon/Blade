local bootstrapper = {}
function bootstrapper:Load()
    if not BLADEDATA then
        BLADEDATA = {}
    end

    if not BLADEDATA.Settings then
        BLADEDATA.Settings = {}
    end
end

function bootstrapper:setOnCommand(handler)
    bootstrapper.onCommand = handler
end

-- have to do this here for now since string.match is unsupported in tstl
SLASH_Blade1 = "/blade"
SLASH_Blade2 = "/bla"
SLASH_Blade3 = "/bl"
SlashCmdList["Blade"] = function(msg)
    local cmd, params = msg:match("^(%S*)%s*(.-)$")

    -- weird setup necessary for tstl interop and this/self handling
    if bootstrapper.onCommand then
        bootstrapper.onCommand(nil, cmd, params)
    end
end

return bootstrapper
