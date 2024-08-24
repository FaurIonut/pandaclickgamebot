import { Telegraf, Markup, Context } from 'telegraf';
import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';

// Load environment variables
dotenv.config();

const token = process.env.TELEGRAM_TOKEN;
const url = process.env.WEBHOOK_URL; // Your Render URL

// Check that token and URL are defined
if (!token || !url) {
    throw new Error('Missing TELEGRAM_TOKEN or WEBHOOK_URL environment variable.');
}

// Create a new Telegram bot
const bot = new Telegraf(token);

// Create a new Express app
const app = express();
app.use(cors());
app.use(express.json());

// Assign telegram channel id
const groupUsername = process.env.GROUP_USERNAME || '';
const channelUsername = process.env.CHANNEL_USERNAME || '';
const twitter = process.env.TWITTER_ID || ''; // Unused

let groupId: number = 0;
let channelID: number = 0;
let USER_ID: number | undefined; // Ensure USER_ID is defined

// Initialize groupId and channelID
bot.telegram.getChat(groupUsername)
    .then(chat => {
        groupId = chat.id;
        console.log('Group ID:', groupId);
    })
    .catch(error => {
        console.error('Error getting group chat:', error);
    });

bot.telegram.getChat(channelUsername)
    .then(chat => {
        channelID = chat.id;
        console.log('Channel ID:', channelID);
    })
    .catch(error => {
        console.error('Error getting channel chat:', error);
    });

// Define the inline keyboard layout for interaction
const options = Markup.inlineKeyboard([
    [Markup.button.webApp('Play in 1 click  🐉', 'https://monster-tap-to-earn-game-frontend-v2.vercel.app/')],
    [Markup.button.url('Subscribe to the channel  🐸', 'https://t.me/MikeTokenAnn')],
    [Markup.button.callback('How to earn from the game  🐲', 'earn')],
    [Markup.button.callback('Task 📝', 'task')]
]);

const option1 = Markup.inlineKeyboard([
    [Markup.button.callback('💰 Join Mike\'s telegram group?   Sure! 👌', 'join')],
    [Markup.button.callback('💰 Subscribe Mike\'s Ann Channel?   Sure! 👌', 'subscribe')],
    [Markup.button.callback('💰 Follow Mike\'s Twitter?          Sure! 👌', 'follow')]
]);

const options3 = Markup.inlineKeyboard([
    [Markup.button.webApp('Play in 1 click  🐉', 'https://monster-tap-to-earn-game-frontend-v2.vercel.app/')],
    [Markup.button.url('Subscribe to the channel  🐸', 'https://t.me/MikeTokenAnn')],
    [Markup.button.callback('Tap to Earn 💰', 'earn')],
    [Markup.button.callback('Task 📝', 'task')]
]);

// Handle the /start command
bot.command('start', (ctx: Context) => {
    const chatId = ctx.chat?.id; // Check if ctx.chat is defined
    const userID = ctx.from?.id;

    if (!chatId || !userID) return; // Ensure chatId and userID are defined

    const welcomeMessage =
        "Hello! Welcome to the Mike Mystery Bot 🐉 🐸 🐲\n\n" +
        "Start our tap-to-earn game by clicking the 'Play' button below. Choose your adventure and start tapping the screen to collect coins.\n\n" +
        "Boost your passive income and develop your own strategy with multi-taps, higher energy, and referrals. Join our social media to become an active member of the CryptoMonsters society with the exclusive 'Mike Token.'\n\n" +
        "In Mystery Bot, all activities are rewarded. Gather as many coins as possible. Once $MKT is listed on T1 & T2 exchanges, you'll receive mysterious, valuable prizes directly to your wallets.\n\n" +
        "Don't forget to invite your friends — you can earn even more together!";

    // Send the welcome message with the inline keyboard
    ctx.reply(welcomeMessage, options);
});

bot.on('message', async (ctx: Context) => {
    const chatId = ctx.chat?.id;
    const userID = ctx.from?.id;

    if (chatId === groupId && userID !== undefined) {
        // Process the message
        ctx.reply(`User ${ctx.from?.username} posted a message in the group.`);

        try {
            await axios.post(
                `https://monster-tap-to-earn-game-backend-v2-1.onrender.com/api/vibe/add`,
                { username: ctx.from?.username }
            );
        } catch (error) {
            console.error('Error posting vibe:', error);
        }
    }
});

// Handle callback queries from inline buttons
bot.on('callback_query', async (ctx: Context) => {
    const callbackQuery = ctx.callbackQuery;

    if (callbackQuery && callbackQuery.data) {
        const callbackData = callbackQuery.data;

        if (callbackData === 'earn') {
            const messagetext =
                "How to play Monster Mystery Bot⚡️\n\n" +
                "💰 Tap to Earn\n\n" +
                "Tap the screen and collect coins. These coins will be exchanged to $MKT at the end of the event.\n\n" +
                "⛏ Mine\n\n" +
                "Upgrade your status by buying special NFTs that will give you higher passive income opportunities (coming soon).\n\n" +
                "⏰ Profit Per Hour\n\n" +
                "The bot itself as well as your status will work for you and mine more coins while you are away!\n\n" +
                "Note: You need to log in to the game again once in a while.\n\n" +
                "👥 Friends & Family\n\n" +
                "Invite your friends and family and you will get bonuses. Help a friend move to the higher levels and you will get even more bonuses.\n\n" +
                "⏳ Token Listings (top 10 exchanges only)\n\n" +
                "At the end of the event, $MKT tokens will be airdropped and distributed among the players. MKT is already transferable and tradable. You can buy, sell or stake in our website to earn even more! You can buy Mike Token ($MKT) at the below exchanges right now:\n\n" +
                "https://pancakeswap.finance/swap?outputCurrency=0xF542aC438CF8Cd4477A1fc7aB88ADDA5426d55Ed\n\n" +
                "https://m.indoex.io/orderbookmobile/MKT_USDT\n\n" +
                "📑 MKT Contract Address:\n\n" +
                "0xF542aC438CF8Cd4477A1fc7aB88ADDA5426d55Ed\n\n" +
                "The exact date of T1 & T2 Exchange listings will be announced in our announcement channel.\n\n" +
                "Have fun and enjoy earning! 💰💰";

            await ctx.answerCbQuery();
            await ctx.reply(messagetext, options3);
        } else if (callbackData === 'task') {
            const messagetext =
                "😊 You will gain bonus! 🚀\n\n" +
                "😎 Join Mike's telegram group\n" +
                "https://t.me/MikeToken\n" +
                "You will receive 1000 coins\n\n" +
                "🤩 Join Mike's Ann Channel\n" +
                "https://t.me/MikeTokenAnn\n" +
                "You will receive 1000 coins\n\n" +
                "😎 Follow Mike's Twitter\n" +
                "https://twitter.com/MikeToken\n" +
                "You will receive 1000 coins\n\n" +
                "All tasks are verified by the bot. If you completed these tasks you will receive coins to your wallet. Please wait for a while and the bot will process your request. After you complete the tasks, your coins will be sent to your account!";

            await ctx.answerCbQuery();
            await ctx.reply(messagetext, option1);
        }
    }
});

// Handle POST request for joining Telegram group
app.post('/joinTG', async (req, res) => {
    const username = req.body.username || '';
    if (!username || USER_ID === undefined) {
        return res.status(400).json({ message: 'Invalid request data' });
    }

    try {
        const member = await bot.telegram.getChatMember(groupId, USER_ID);
        if (member.status !== 'left' && member.status !== 'kicked') {
            await axios.post(
                `https://monster-tap-to-earn-game-backend-v2-1.onrender.com/api/earnings/add`,
                { username }
            );
            await axios.post(
                `https://monster-tap-to-earn-game-backend-v2-1.onrender.com/api/earnings/update/joinTelegram/${username}`,
                { status: true, earned: false }
            );
            res.status(200).json({ message: 'ok', username });
        } else {
            res.status(400).json({ message: 'You are not in the group now', username });
        }
    } catch (error) {
        console.error('Error checking chat member:', error);
        res.status(500).json({ message: 'Error checking chat member', username });
    }
});

// Handle POST request for joining Telegram channel
app.post('/joinTC', async (req, res) => {
    const username = req.body.username || '';
    if (!username || USER_ID === undefined) {
        return res.status(400).json({ message: 'Invalid request data' });
    }

    try {
        const member = await bot.telegram.getChatMember(channelID, USER_ID);
        if (member.status !== 'left' && member.status !== 'kicked') {
            await axios.post(
                `https://monster-tap-to-earn-game-backend-v2-1.onrender.com/api/earnings/add`,
                { username }
            );
            await axios.post(
                `https://monster-tap-to-earn-game-backend-v2-1.onrender.com/api/earnings/update/subscribeTelegram/${username}`,
                { status: true, earned: false }
            );
            res.status(200).json({ message: 'ok', username });
        } else {
            res.status(400).json({ message: 'You are not in the channel now', username });
        }
    } catch (error) {
        console.error('Error checking chat member:', error);
        res.status(500).json({ message: 'Error checking chat member', username });
    }
});

// Set the bot API endpoint
app.use(bot.webhookCallback(`/bot${token}`));

// Set webhook
bot.telegram.setWebhook(`${url}/bot${token}`);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
