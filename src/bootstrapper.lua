local Bootstrapper = {}

function Bootstrapper:Load()
    if not BladeDB then
        BladeDB = {}
    end

    if not BladeDB.Settings then
        BladeDB.Settings = {}
    end
end

return Bootstrapper
