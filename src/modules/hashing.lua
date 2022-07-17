local ns, Blade = ...

local moduleName = "MODULES.HASHING"

Blade:RegisterModule(
    moduleName,
    function(...)
        local function getHash(algo, input)
            return Blade.sha[algo](input)
        end

        local function printHash(algo, input)
            Blade:Print(getHash(algo, input))
        end

        local hashing_algos = {"md5", "sha256", "sha512"}

        for i, algo in ipairs(hashing_algos) do
            Blade:RegisterCommand(
                algo,
                function(input)
                    printHash(algo, input)
                end
            )
        end
    end
)
