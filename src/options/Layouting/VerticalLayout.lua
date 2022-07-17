local ns, Blade = ...

local function VerticalLayout(panel)
    local kids = {panel:GetChildren()}

    local lastChild = nil
    if #kids > 0 then
        local padding = panel.padding or 0
        local totalHeight = padding
        local visibleHeight = padding
        local maxWidth = 0
        for i, child in ipairs(kids) do
            local height = child:GetHeight()
            local width = child:GetWidth()
            if child:IsShown() then
                child:ClearAllPoints()
                if not lastChild then
                    child:SetPoint("TOPLEFT", panel, "TOPLEFT", padding, -(padding))
                else
                    child:SetPoint(
                        "TOPLEFT",
                        lastChild,
                        "BOTTOMLEFT",
                        0,
                        child.ExtraHeight and -child:ExtraHeight() or 0
                    )
                end
                visibleHeight = visibleHeight + height
            end
            totalHeight = totalHeight + height
            if width > maxWidth then
                maxWidth = width
            end

            lastChild = child
        end

        panel:SetWidth(maxWidth)
        panel:SetHeight(totalHeight)
    end
end

Blade.Options.Layouting.VerticalLayout = VerticalLayout
