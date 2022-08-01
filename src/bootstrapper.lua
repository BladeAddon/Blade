local ns, Blade = ...

Blade.namespace = ns

if not BladeDB then
    BladeDB = {}
end

if not BladeDB.Settings then
    BladeDB.Settings = {}
end

return Blade
