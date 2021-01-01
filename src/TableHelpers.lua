function Any(t)
    for i, v in ipairs(t) do
        if v then
            return true
        end
    end
    return false
end
