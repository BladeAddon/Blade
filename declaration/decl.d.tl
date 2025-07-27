global LibStub: function <Lib>(name: string): Lib

global record AceAddon
    NewAddon: function(self, name: string)
    OnInitialize: function(self)
end

global SlashCmdList: {string:function (message: string, edit_box: any)}

global GetTime: function(): number
global date: function(): string

require("addon")
