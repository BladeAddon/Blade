local ns, BLADE = ...

BLADE.events = {}
BLADE.removeEvents = {}
BLADE.combatlogevents = {}
BLADE.combatlogaffixes = {}
BLADE.EVENT_PREFIX = "BLADE_"

function BLADE:RegisterEvent(event, handler)
    if not self.events[event] then
        local retOK, ret1 = pcall(self.frame.RegisterEvent, self.frame, event)
        if not retOK then
            if strfind(ret1, "unknown event") and strmatch(event, BLADE.EVENT_PREFIX .. ".*") then
                -- internal event, not a real error
            else
                error(ret1)
            end
        end
        self.events[event] = {}
    end

    table.insert(self.events[event], handler)
end

function BLADE:RegisterEvents(handler, ...)
    local t = {...}
    for i = 1, #t do
        self:RegisterEvent(t[i], handler)
    end
end

function BLADE:RegisterEventOnce(event, handler)
    self:RegisterEvent(event, handler)

    if not self.removeEvents[event] then
        self.removeEvents[event] = {}
    end

    table.insert(self.removeEvents[event], handler)
end

function BLADE:RemoveEventHandler(event, handler)
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

function BLADE:RegisterCombatLogEvent(event, handler)
    if not self.combatlogevents[event] then
        self.combatlogevents[event] = {}
    end

    table.insert(self.combatlogevents[event], handler)
end

function BLADE:RegisterCombatLogAffix(affix, handler)
    if not self.combatlogaffixes[affix] then
        self.combatlogaffixes[affix] = {}
    end

    table.insert(self.combatlogaffixes[affix], handler)
end

local function OnEvent(frame, event, ...)
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

function BLADE:PublishInternalEvent(event, ...)
    OnEvent(self, event, ...)
end

BLADE.frame:SetScript(
    "OnEvent",
    function(frame, event, ...)
        OnEvent(frame, event, ...)
    end
)
