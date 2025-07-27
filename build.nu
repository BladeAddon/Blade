let src_dir = 'src' | path expand
let out_dir = 'out' | path expand

# <Ui xmlns="http://www.blizzard.com/wow/ui/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" schemaLocation="http://www.blizzard.com/wow/ui/../FrameXML/UI.xsd">
#   <Script file="lib/LibStub/LibStub.lua" />
#   <Script file="lib/CallbackHandler-1.0/CallbackHandler-1.0.lua" />
#   <Script file="lib/LibSharedMedia-3.0/LibSharedMedia-3.0.lua" />
#   <Include file="lib/AceDB-3.0/AceDB-3.0.xml"/>
#   <Include file="lib/AceDBOptions-3.0/AceDBOptions-3.0.xml"/>
#   <Include file="lib/AceLocale-3.0/AceLocale-3.0.xml"/>
#   <Include file="lib/AceGUI-3.0/AceGUI-3.0.xml"/>
#   <Include file="lib/AceConfig-3.0/AceConfig-3.0.xml"/>

#   <Script file="locales/enUS.lua" />

#   <Script file="blade.lua" />
# </Ui>

glob src/**/*.tl --no-dir | each { |f|
    let out_path = ($out_dir | path join ($f | path relative-to $src_dir | path parse --extension 'tl' | upsert extension 'lua' | path join))
    let out_dir =  $out_path | path dirname
    mkdir $out_dir
    tl gen --skip-compat53 $f --output $out_path
}

cp --recursive --update lib out/

glob src/**/*.{lua,xml,toc} --no-dir | each { |f|
    let out_path = ($out_dir | path join ($f | path relative-to $src_dir))
    let out_dir =  $out_path | path dirname
    mkdir $out_dir
    cp --update $f $out_path
}

# mut embeds = {tag: Ui attributes: {
#     xmlns: "http://www.blizzard.com/wow/ui/"
#     'xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance"
#     schemaLocation: "http://www.blizzard.com/wow/ui/../FrameXML/UI.xsd"
# }}

# mut embeds_content = []

# glob out/**/*.{lua,xml} | each { |f|
#     let relative_path = $f | path relative-to $out_dir
#     print $relative_path
# }
