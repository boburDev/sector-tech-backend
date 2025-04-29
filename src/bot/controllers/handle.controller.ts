import { Context } from "telegraf";

export const startCommand = async (ctx: Context) => {
    console.log(ctx.chat);
    
    await ctx.reply("Hello, world!");
}
