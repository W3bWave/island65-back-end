const express = require('express')
const router = express.Router()
const { Bot, InlineKeyboard } = require("grammy");
const bot = new Bot("7539034571:AAFwuYHLZWQq-CEGjjg9rdz3Qg7QZKBxpm0");
//https://t.me/island65_bot/Islands65

try {
  bot.command("start", (ctx) => ctx.reply("Проект команды W3BWAVE.",{
    reply_markup : new InlineKeyboard().url("Открыть Острова.65","https://t.me/island65_bot/Islands65")
}));
  bot.start();
} catch (error) {
  console.log(error);
  
}

router.post('/', (req, res) => {
  res.send('Birds home page')
})
// define the about route
router.get('/about', (req, res) => {
  res.send('About birds')
})

function sendMessage(id,message,link){
  bot.api.sendMessage(id,message,{
    reply_markup : new InlineKeyboard().url("Написать",link)
  });
}
module.exports = {telegramRouter: router, sendMessage : sendMessage}