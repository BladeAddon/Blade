local ns, Blade = ...

Blade.events = {}
Blade.removeEvents = {}
Blade.combatlogevents = {}
Blade.combatlogaffixes = {}
Blade.EVENT_PREFIX = "BLADE_"

function Blade:IsEventRegistered(event)
    return self.events[event] ~= nil
end

function Blade:RegisterEvent(event, handler)
    if not self.events[event] then
        local retOK, ret1 = pcall(self.frame.RegisterEvent, self.frame, event)
        if not retOK then
            if strfind(ret1, "unknown event") and strmatch(event, Blade.EVENT_PREFIX .. ".*") then
                -- internal event, not a real error
            else
                error(ret1)
            end
        end
        self.events[event] = {}
    end

    table.insert(self.events[event], handler)
end

function Blade:RegisterEvents(handler, ...)
    local t = {...}
    for i = 1, #t do
        self:RegisterEvent(t[i], handler)
    end
end

function Blade:RegisterEventOnce(event, handler)
    self:RegisterEvent(event, handler)

    if not self.removeEvents[event] then
        self.removeEvents[event] = {}
    end

    table.insert(self.removeEvents[event], handler)
end

function Blade:RemoveEventHandler(event, handler)
    if not self.events[event] then
        return
    end

    local toRemove = {}
    for i = 1, #self.events[event] do
        if self.events[event][i] == handler then
            table.remove(self.events[event], i)
            return
        end
    end
end

local function registerCombatLogEvent()
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
end

function Blade:RegisterCombatLogEvent(event, handler)
    if not self:IsEventRegistered("COMBAT_LOG_EVENT_UNFILTERED") then
        registerCombatLogEvent()
    end

    if not self.combatlogevents[event] then
        self.combatlogevents[event] = {}
    end

    table.insert(self.combatlogevents[event], handler)
end

function Blade:RegisterCombatLogAffix(affix, handler)
    if not self:IsEventRegistered("COMBAT_LOG_EVENT_UNFILTERED") then
        registerCombatLogEvent()
    end

    if not self.combatlogaffixes[affix] then
        self.combatlogaffixes[affix] = {}
    end

    table.insert(self.combatlogaffixes[affix], handler)
end

local function OnEvent(frame, event, ...)
    for k, v in pairs(Blade.events) do
        if event == k then
            for i = 1, #v do
                v[i](...)
            end
        end
    end

    for k, v in pairs(Blade.removeEvents) do
        if event == k then
            for i = 1, #v do
                for j = 1, #Blade.events[event] do
                    if v[i] == Blade.events[event][j] then
                        table.remove(Blade.events[event], j)
                        table.remove(Blade.removeEvents[event], i)
                        break
                    end
                end
            end
        end
    end
end

function Blade:PublishInternalEvent(event, ...)
    OnEvent(self, event, ...)
end

Blade.frame:SetScript(
    "OnEvent",
    function(frame, event, ...)
        OnEvent(frame, event, ...)
    end
)
