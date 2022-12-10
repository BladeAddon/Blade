export class ColorHelper {
    public static readonly DEEP_PINK = "|cFFff1493"
    public static readonly WHITE = "|cFFFFFFFF"
    public static readonly RETURN_COLOR = "|r"

    public static Encode(str: string, color: string): string {
        return color + str + ColorHelper.RETURN_COLOR
    }
}
