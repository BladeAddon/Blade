local ns, BLADE = ...

BLADE.events = {}
BLADE.removeEvents = {}
BLADE.combatlogevents = {}
BLADE.combatlogaffixes = {}

function BLADE:RegisterEvent(event, handler)
    if not self.events[event] then
        self.frame:RegisterEvent(event)
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
