local ns, BLADE = ...

BLADE.onFrameHandlers = {}
BLADE.inits = {}

function BLADE:OnFrame(func)
    table.insert(self.onFrameHandlers, func)
end

function BLADE:Init(handler)
    table.insert(self.inits, handler)
end

local loadedaddons = {}
BLADE:RegisterEvent(
    "ADDON_LOADED",
    function(addon)
        loadedaddons[addon] = true
        if addon == BLADE.AddonName then
            for k, v in pairs(BLADE.inits) do
                v()
            end
        end
    end
)

function BLADE:IsAddonLoaded(addon)
    return loadedaddons[addon] == true
end

BLADE:RegisterEvent(
    "COMBAT_LOG_EVENT_UNFILTERED",
    function(
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
        arg20)
        -- local timestamp,
        --     event,
        --     hideCaster,
        --     sourceGUID,
        --     sourceName,
        --     sourceFlags,
        --     sourceRaidFlags,
        --     destGUID,
        --     destName,
        --     destFlags,
        --     destRaidFlags,
        --     arg1,
        --     arg2,
        --     arg3,
        --     arg4,
        --     arg5,
        --     arg6,
        --     arg7,
        --     arg8,
        --     arg9,
        --     arg10,
        --     arg11,
        --     arg12,
        --     arg13,
        --     arg14,
        --     arg15,
        --     arg16,
        --     arg17,
        --     arg18,
        --     arg19,
        --     arg20 = CombatLogGetCurrentEventInfo()

        local handlers = {}
        for k, v in pairs(BLADE.combatlogevents) do
            if k == event then
                for i = 1, #v do
                    table.insert(handlers, v[i])
                end
            end
        end

        for k, v in pairs(BLADE.combatlogaffixes) do
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

BLADE:RegisterEvent(
    "PLAYER_ENTERING_WORLD",
    function()
        BLADE.Player.guid = BLADE.Player._guid()
    end
)

BLADE.frame:SetScript(
    "OnUpdate",
    function(f, sinceLastUpdate)
        for i = 1, #BLADE.onFrameHandlers do
            local func = BLADE.onFrameHandlers[i]
            if func ~= nil then
                func(BLADE, sinceLastUpdate)
            end
        end
    end
)

BLADE.frame:SetScript(
    "OnEvent",
    function(frame, event, ...)
        for k, v in pairs(BLADE.events) do
            if event == k then
                for i = 1, #v do
                    v[i](...)
                end
            end
        end

        for k, v in pairs(BLADE.removeEvents) do
            if event == k then
                for i = 1, #v do
                    for j = 1, #BLADE.events[event] do
                        if v[i] == BLADE.events[event][j] then
                            table.remove(BLADE.events[event], j)
                            table.remove(BLADE.removeEvents[event], i)
                            break
                        end
                    end
                end
            end
        end
    end
)

BLADE:Init(
    function()
        for moduleName, moduleBootstrap in pairs(BLADE.modules) do
            moduleBootstrap(BLADE)
        end
    end
)
