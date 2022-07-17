function Any(t)
    for _, v in ipairs(t) do
        if v then
            return true
        end
    end
    return false
end
