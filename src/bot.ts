import { Telegraf } from "telegraf";
import TelegramBot, { CallbackQuery } from "node-telegram-bot-api";
import dotenv from "dotenv";
import axios from "axios";
import express from "express";
import cors from "cors";

// Load environment variables
dotenv.config();

const token = process.env.TELEGRAM_TOKEN;
console.log("Bot token:", token); // Confirm token is loaded

// Create a new Telegram bot using polling to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Assign telegram channel id
const groupUsername = process.env.GROUP_USERNAME;
const channelUsername = process.env.CHANNEL_USERNAME;

let groupId: number = 0;
let channelID: number = 0;
let USER_ID: number = 0;
let USER_NAME: string = "Leo_mint";

bot
  .getChat(groupUsername)
  .then((chat: any) => {
    groupId = chat.id;
    console.log("Group ID:", groupId);
  })
  .catch((error: any) => {
    console.error("Error getting chat:", error);
  });

bot
  .getChat(channelUsername)
  .then((chat: any) => {
    channelID = chat.id;
    console.log("Channel ID:", channelID);
  })
  .catch((error: any) => {
    console.error("Error getting chat:", error);
  });

const options = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "Play in 1 click  🐉",
          web_app: { url: "https://monster-tap-to-earn-game-frontend-v2.vercel.app/" },
        },
      ],
      [
        {
          text: "Subscribe to the channel  🐸",
          url: "https://t.me/MikeTokenAnn",
        },
      ],
      [{ text: "How to earn from the game  🐲", callback_data: "earn" }],
      [{ text: "Task 📝", callback_data: "task" }],
    ],
  },
};

const options3 = {
  parse_mode: "HTML",
  disable_web_page_preview: true,
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "Play in 1 click  🐉",
          web_app: { url: "https://monster-tap-to-earn-game-frontend-v2.vercel.app/" },
        },
      ],
      [
        {
          text: "Subscribe to the channel  🐸",
          url: "https://t.me/MikeTokenAnn",
        },
      ],
      [{ text: "Tap to Earn 💰", callback_data: "earn" }],
      [{ text: "Task 📝", callback_data: "task" }],
    ],
  },
};

// Handle the /start command
bot.onText(/\/start/, (msg: any) => {
  const chatId = msg.chat.id;
  const welcomeMessage = "Hello! Welcome to the Mike Mystery Bot 🐉 🐸 🐲 ...";
  bot.sendMessage(chatId, welcomeMessage, options);
});

bot.on("message", async (msg: any) => {
  const chatId = msg.chat.id;
  USER_ID = chatId;
  const userID = msg.from.id;
  USER_NAME = msg.from?.username;

  if (msg.chat.id === groupId && msg.from.id === userID) {
    bot.sendMessage(msg.chat.id, `User ${msg.from.username} posted a message in the group.`);
    try {
      await axios.post(`https://monster-tap-to-earn-game-backend-v2-1.onrender.com/api/vibe/add`, {
        username: msg.from.username,
      });
      console.log("--//---OK!!!--vibe user--//---", msg.from.username);
    } catch (error) {
      console.error(error);
    }
  }
});

// Handle callback queries from inline buttons
bot.on("callback_query", (callbackQuery: CallbackQuery) => {
  const message = callbackQuery.message;
  const category = callbackQuery.data; // The 'callback_data' associated with the button pressed.

  if (category === "earn") {
    const messagetext = "How to play Monster Mystery Bot⚡️ ...";
    bot.sendMessage(message.chat.id, messagetext, options3);
  }

  if (category === "task") {
    const messagetext = "😊 You will gain bonus! 🚀 ...";
    bot.sendMessage(message.chat.id, messagetext, options);
  }
});

bot.onText(/\/start (.+)/, async (msg: any, match: any) => {
  const chatId = msg.chat.id;
  const referrerUsername = match[1];
  try {
    await axios.post(`https://monster-tap-to-earn-game-backend-v2-1.onrender.com/api/friend/add`, {
      username: referrerUsername,
      friend: USER_NAME,
    });
    const response00 = await axios.post(`https://monster-tap-to-earn-game-backend-v2-1.onrender.com/api/wallet/add`, {
      username: USER_NAME,
    });
    const response0 = await axios.post(`https://mike-token-backend-1.onrender.com/api/wallet/updateBalance/${USER_NAME}`, { balance: 200 });
    const response1 = await axios.post(`https://mike-token-backend-1.onrender.com/api/wallet/${referrerUsername}`);
    const response2 = await axios.post(`https://mike-token-backend-1.onrender.com/api/wallet/updateBalance/${referrerUsername}`, { balance: 200 + response1.data.balance });
    console.log(response2.data);
  } catch (error) {
    console.error(error);
  }
});

const app = express();
app.use(cors());
app.use(express.json());

app.post("/joinTG", (req: any, res: any) => {
  const username = req.body["username"];
  bot.getChatMember(groupId, USER_ID)
    .then(async (member: any) => {
      if (member.status !== "left" && member.status !== "kicked") {
        try {
          await axios.post(`https://monster-tap-to-earn-game-backend-v2-1.onrender.com/api/earnings/add`, { username: username });
          await axios.post(`https://monster-tap-to-earn-game-backend-v2-1.onrender.com/api/earnings/update/joinTelegram/${username}`, { status: true, earned: false });
          res.status(200).json({ message: "ok", username: username });
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        res.status(400).json({ message: "you are not in group now", username: username });
      }
    })
    .catch((error: any) => {
      console.error("Error checking chat member:", error);
      res.status(404).json({ message: "Error checking chat member", username: username });
    });
});

app.post("/joinTC", (req: any, res: any) => {
  const username = req.body["username"];
  bot.getChatMember(channelID, USER_ID)
    .then(async (member: any) => {
      if (member.status !== "left" && member.status !== "kicked") {
        try {
          await axios.post(`https://monster-tap-to-earn-game-backend-v2-1.onrender.com/api/earnings/add`, { username: username });
          await axios.post(`https://monster-tap-to-earn-game-backend-v2-1.onrender.com/api/earnings/update/subscribeTelegram/${username}`, { status: true, earned: false });
          res.status(200).json({ message: "ok", username: username });
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        res.status(400).json({ message: "you are not in group now", username: username });
      }
    })
    .catch((error: any) => {
      console.error("Error checking chat member:", error);
      res.status(404).json({ message: "Error checking chat member", username: username });
    });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
