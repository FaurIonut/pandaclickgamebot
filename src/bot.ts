import { Telegraf } from 'telegraf';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';

// Load environment variables
dotenv.config();

const token = process.env.TELEGRAM_TOKEN!;
const webhookUrl = 'https://pandaclickgamebot.onrender.com/bot'; // Replace with your actual Render URL

// Create a new Telegram bot
const bot = new Telegraf(token);

// Assign telegram channel id
const groupUsername = process.env.GROUP_USERNAME!;
const channelUsername = process.env.CHANNEL_USERNAME!;
const twitter = process.env.TWITTER_ID!;

let groupId: number = 0;
let channelID: number = 0;
let twitterID: number = 0;

let USER_ID: number = 0;
let USER_NAME: string = 'Leo_mint';
let chatId: number = 0;

// Set up webhook
bot.telegram.setWebhook(`${webhookUrl}?token=${token}`);

// Create Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Handle webhook POST requests
app.post('/bot', (req, res) => {
    bot.handleUpdate(req.body);
    res.sendStatus(200); // Respond with 200 OK
});

bot.on('text', async (ctx) => {
    chatId = ctx.chat.id;
    USER_ID = ctx.from.id;
    USER_NAME = ctx.from.username || 'Unknown';

    console.log('--//---myChatID----//---', chatId);
    console.log('--//---myUserID----//---', USER_ID);

    if (ctx.chat.id === groupId && ctx.from.id === USER_ID) {
        console.log(`User ${ctx.from.username} (ID: ${ctx.from.id}) posted a message in the group.`);
        await ctx.reply(`User ${ctx.from.username} posted a message in the group.`);

        try {
            await axios.post(
                'https://monster-tap-to-earn-game-backend-v2-1.onrender.com/api/vibe/add',
                { username: ctx.from.username }
            );
            console.log('--//---OK!!!--vibe user--//---', ctx.from.username);
        } catch (error) {
            console.error(error);
        }
    }
});

// Handle the /start command
bot.command('start', (ctx) => {
    chatId = ctx.chat.id;

    const welcomeMessage =
        'Hello! Welcome to the Mike Mystery Bot 🐉 🐸 🐲...\n\nStart our tap-to-earn game by clicking the “Play” button below...';

    ctx.reply(welcomeMessage, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Play in 1 click  🐉',
                        web_app: { url: 'https://monster-tap-to-earn-game-frontend-v2.vercel.app/' },
                    },
                ],
                [
                    {
                        text: 'Subscribe to the channel  🐸',
                        url: 'https://t.me/MikeTokenAnn',
                    },
                ],
                [{ text: 'How to earn from the game  🐲', callback_data: 'earn' }],
                [{ text: 'Task 📝', callback_data: 'task' }],
            ],
        },
    });
});

bot.on('callback_query', async (ctx) => {
    const category = ctx.callbackQuery.data; // The 'callback_data' associated with the button pressed.

    if (category === 'earn') {
        const messagetext =
            'How to play Monster Mystery Bot⚡️...\n\n💰 Tap to Earn...\n\n⛏ Mine...\n\n⏰ Profit Per Hour...';

        await ctx.reply(messagetext, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Play in 1 click  🐉',
                            web_app: { url: 'https://monster-tap-to-earn-game-frontend-v2.vercel.app/' },
                        },
                    ],
                    [
                        {
                            text: 'Subscribe to the channel  🐸',
                            url: 'https://t.me/MikeTokenAnn',
                        },
                    ],
                    [{ text: 'Tap to Earn 💰', callback_data: 'earn' }],
                    [{ text: 'Task 📝', callback_data: 'task' }],
                ],
            },
        });
    }

    if (category === 'task') {
        const messagetext =
            '😊 You will gain bonus! 🚀...\n\n😎 Join Mike\'s telegram group...\n\n🤩 Join Mike\'s Ann Channel...\n\n😍 Follow our twitter!...';

        await ctx.reply(messagetext, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '💰 Join Mike\'s telegram group?   Sure! 👌 ',
                            callback_data: 'join',
                        },
                    ],
                    [
                        {
                            text: '💰 Subscribe Mike\'s Ann Channel?   Sure! 👌 ',
                            callback_data: 'subscribe',
                        },
                    ],
                    [
                        {
                            text: '💰 Follow Mike\'s Twitter?          Sure! 👌 ',
                            callback_data: 'follow',
                        },
                    ],
                ],
            },
        });
    }
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
