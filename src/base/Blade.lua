local ns, Blade = ...

Blade.AddonName = "Blade"
Blade.Loaded = false
Blade.frame = CreateFrame("FRAME")
Blade.modules = {}
Blade.Player = {
    _guid = function()
        return UnitGUID("player")
    end,
    InCombat = function()
        return UnitAffectingCombat("player")
    end
}

function Blade:RegisterAPI(handler)
    handler(self)
end

function Blade:RegisterModule(name, bootstrap)
    if self.modules[name] then
        return
    end

    self.modules[name] = bootstrap
end
