local bootstrapper = {}
function bootstrapper:Load()
    if not BLADEDATA then
        BLADEDATA = {}
    end

    if not BLADEDATA.Settings then
        BLADEDATA.Settings = {}
    end
end

return bootstrapper
