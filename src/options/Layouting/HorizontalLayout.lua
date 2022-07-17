local ns, Blade = ...

local function HorizontalLayout(panel)
    local kids = {panel:GetChildren()}

    if #kids > 0 then
        local lastChild = nil
        local padding = panel.padding or 0
        local totalWidth = padding
        local visibleWidth = padding
        local maxHeight = 0
        for i, child in ipairs(kids) do
            local height = child:GetHeight()
            local width = child:GetWidth()
            if child:IsShown() then
                child:ClearAllPoints()
                if not lastChild then
                    child:SetPoint("TOPLEFT", panel, "TOPLEFT", padding, -padding)
                else
                    child:SetPoint(
                        "TOPLEFT",
                        lastChild,
                        "TOPRIGHT",
                        lastChild.ExtraWidth and lastChild:ExtraWidth() or 0,
                        0
                    )
                end
                -- child:SetPoint("TOPLEFT", visibleWidth, panel.padding or 0)
                visibleWidth = visibleWidth + width
            end
            totalWidth = totalWidth + width
            if height > maxHeight then
                maxHeight = height
            end

            lastChild = child
        end

        panel:SetWidth(totalWidth)
        panel:SetHeight(maxHeight)
    end
end

Blade.Options.Layouting.HorizontalLayout = HorizontalLayout
