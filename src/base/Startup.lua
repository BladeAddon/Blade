local ns, Blade = ...

Blade.onFrameHandlers = {}
Blade.inits = {}

function Blade:OnFrame(func)
    table.insert(self.onFrameHandlers, func)
end

function Blade:Init(handler)
    table.insert(self.inits, handler)
end

local loadedaddons = {}
Blade:RegisterEvent(
    "ADDON_LOADED",
    function(addon)
        loadedaddons[addon] = true
        if addon == Blade.AddonName then
            for k, v in pairs(Blade.inits) do
                v()
            end

            Blade.Loaded = true
        end
    end
)

function Blade:IsAddonLoaded(addon)
    return loadedaddons[addon] == true
end

Blade:RegisterEvent(
    "COMBAT_LOG_EVENT_UNFILTERED",
    function()
        local timestamp,
            event,
            hideCaster,
            sourceGUID,
            sourceName,
            sourceFlags,
            sourceRaidFlags,
            destGUID,
            destName,
            destFlags,
            destRaidFlags,
            arg1,
            arg2,
            arg3,
            arg4,
            arg5,
            arg6,
            arg7,
            arg8,
            arg9,
            arg10,
            arg11,
            arg12,
            arg13,
            arg14,
            arg15,
            arg16,
            arg17,
            arg18,
            arg19,
            arg20 = CombatLogGetCurrentEventInfo()

        local handlers = {}
        for k, v in pairs(Blade.combatlogevents) do
            if k == event then
                for i = 1, #v do
                    table.insert(handlers, v[i])
                end
            end
        end

        for k, v in pairs(Blade.combatlogaffixes) do
            if string.find(event, k) then
                for i = 1, #v do
                    table.insert(handlers, v[i])
                end
            end
        end

        for i = 1, #handlers do
            handlers[i](
                timestamp,
                event,
                hideCaster,
                sourceGUID,
                sourceName,
                sourceFlags,
                sourceRaidFlags,
                destGUID,
                destName,
                destFlags,
                destRaidFlags,
                arg1,
                arg2,
                arg3,
                arg4,
                arg5,
                arg6,
                arg7,
                arg8,
                arg9,
                arg10,
                arg11,
                arg12,
                arg13,
                arg14,
                arg15,
                arg16,
                arg17,
                arg18,
                arg19,
                arg20
            )
        end
    end
)

Blade:RegisterEvent(
    "PLAYER_ENTERING_WORLD",
    function()
        Blade.Player.guid = Blade.Player._guid()
    end
)

Blade.frame:SetScript(
    "OnUpdate",
    function(f, sinceLastUpdate)
        for i = 1, #Blade.onFrameHandlers do
            local func = Blade.onFrameHandlers[i]
            if func ~= nil then
                func(Blade, sinceLastUpdate)
            end
        end
    end
)

Blade:Init(
    function()
        for moduleName, moduleBootstrap in pairs(Blade.modules) do
            moduleBootstrap(Blade)
        end
    end
)
