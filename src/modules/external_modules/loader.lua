local ns, internal_blade = ...

internal_blade.external_modules = {}

BLAPI = {}

local external_blade = BLAPI

local function create_settings(module)
    return internal_blade:GetSettings(module.key)
end

local function create_blade_module(module)
    local module_key = module.key

    local external_module = {
        Settings = create_settings(module),
        Name = module.name,
        Hash = module.hash,
        Key = module.key
    }

    function external_module:GetSetting(key, defaultValue)
        return internal_blade:GetSetting(module_key, key, defaultValue)
    end

    function external_module:SetSetting(key, value)
        return internal_blade:SetSetting(module_key, key, value)
    end

    function external_module:GetKey()
        return module_key
    end

    return external_module
end

function external_blade:RegisterModule(name, bootstrap)
    if internal_blade.external_modules[name] then
        return
    end

    local module = {}
    module.bootstrap = bootstrap
    module.name = name
    module.hash = internal_blade.sha.sha256(name)
    module.key = "MODULES.EXTERNAL." .. module.hash
    module.blade = create_blade_module(module)

    internal_blade.external_modules[name] = module

    if internal_blade.Loaded then
        bootstrap(module.blade)
    end
end

internal_blade:Init(
    function()
        for _, module in pairs(internal_blade.external_modules) do
            module.bootstrap(module.blade)
        end
    end
)
