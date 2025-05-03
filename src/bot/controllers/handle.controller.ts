import { Context } from "telegraf";
import { verify } from "../../utils/jwt";

export const startCommand = async (ctx: Context & { startPayload?: string }) => {
    try {
        const payload = ctx?.startPayload;
        if (!payload) {
            ctx.reply("Token not found");
            return;
        }

        const decodedData = verify(payload, "user")
        console.log(decodedData);
        
        ctx.reply(`Siz yuborgan token:`);
    } catch (error) {
        console.log(error);
    }
}
