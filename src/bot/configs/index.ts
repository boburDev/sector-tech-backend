import { Telegraf, session, Context } from 'telegraf';
import { BOT_TOKEN } from '../../config/env';

if (!BOT_TOKEN) {
    console.error("❌ BOT_TOKEN is missing in environment variables. Exiting...");
    process.exit(1);
}

const bot = new Telegraf<Context>(BOT_TOKEN);

const rateLimitWindowMs = 5 * 1000;
const maxRequests = 10;
const userRequests: Map<number, number[]> = new Map();

bot.use(async (ctx, next) => {
    if (!ctx.chat) return next();
    console.log(ctx.chat);
    

    const userId = ctx.chat.id;
    const currentTime = Date.now();

    if (!userRequests.has(userId)) {
        userRequests.set(userId, []);
    }

    const timestamps = userRequests.get(userId)!.filter(ts => ts > currentTime - rateLimitWindowMs);
    timestamps.push(currentTime);

    if (timestamps.length > maxRequests) {
        await ctx.reply("🚫 Rate limit exceeded. Please try again later.", { parse_mode: 'Markdown' });
        return;
    }

    userRequests.set(userId, timestamps);
    await next();
    console.log(1);
});

bot.use(session());


export default bot;
