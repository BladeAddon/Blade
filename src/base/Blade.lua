local ns, BLADE = ...

BLADE.AddonName = "Blade"
BLADE.frame = CreateFrame("FRAME")
BLADE.modules = {}
BLADE.Player = {
    _guid = function()
        return UnitGUID("player")
    end,
    InCombat = function()
        return UnitAffectingCombat("player")
    end
}

function BLADE:RegisterAPI(handler)
    handler(self)
end

function BLADE:RegisterModule(name, bootstrap)
    if self.modules[name] then
        return
    end

    self.modules[name] = bootstrap
end
