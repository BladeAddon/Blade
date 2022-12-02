export class ColorHelper {
    public static readonly DEEP_PINK = "|cFFff1493"
    public static readonly WHITE = "|cFFFFFFFF"
    public static readonly DODGER_BLUE = "|cFF1E90FF"
    public static readonly RETURN_COLOR = "|r"

    public static readonly HIGHLIGHT_COLOR = ColorHelper.DODGER_BLUE
    public static readonly TEXT_COLOR = ColorHelper.WHITE

    public static Encode(str: string, color: string): string {
        return color + str + ColorHelper.RETURN_COLOR
    }
}
