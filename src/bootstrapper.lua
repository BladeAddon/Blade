local bootstrapper = {}
function bootstrapper:Load()
    if not BLADETSDATA then
        BLADETSDATA = {}
    end

    if not BLADETSDATA.Settings then
        BLADETSDATA.Settings = {}
    end
end
return bootstrapper
