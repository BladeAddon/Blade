require("chat")

global BLADEDATA: {string:any}
global SLASH_Blade1: string
global SLASH_Blade2: string
global SLASH_Blade3: string

global record Addon
    db: {string:any}
    settings: {any:any}
    ace_addon: AceAddon
    command_handler: CommandHandler
end
