import { startCommand } from './controllers/handle.controller';
import bot from './configs/index';

bot.start(startCommand);

export default bot;
