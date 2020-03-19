const telebot = require("botgram");
const bot = telebot("1069916607:AAEVs8ehadEW54FzncQ6qaIBDRQwo5fm0Nc");
const express = require('express');
const app = express();
var fs = require("fs");
var counter = 0;

app.listen(3000);
var mesange = "";
bot.command("start", (msg, reply) =>
  reply.text("To schedule an alert, do: /alert <seconds> <text>"))

  // bot.hears('hello', async ctx => {
  //   await ctx.reply('Hello!');
  // });
bot.command("alert", (msg, reply, next) => {
  var [ seconds, text ] = msg.args(2)
  if (!seconds.match(/^\d+$/) || !text) return next()

  setTimeout(() => reply.text(text), Number(seconds) * 1000)
})
bot.command("photo", (msg, reply, next) => {
  var buffer = fs.readFileSync("photo/cats.jpg");
  buffer.options = "cats.jpg";
  
  reply.photo(buffer, "Random photo");

})
bot.command("date", function (msg, reply, next){
  var date = new Date();
  reply.markdown("Now year: "+ date.getFullYear() + "\n"+ "Now time "+date.getHours()+":"+date.getMinutes());
});
bot.command("help", function (msg, reply, next) {
  reply.markdown("Hey! I'm a simple bot that will send you chat actions. Use /start to get a list of actions to send.");
  reply.text("/start - start bot");
  reply.text("/help - help with commands");
  reply.text("/photo - displays photos in the chat");
  reply.text("/date - displays the date and time");
  reply.text("/alert - displays messages after a specified time");
  reply.text("/press - seemingly pressing a button");
  reply.text("/count - counts how many times the button was clicked");
  reply.text("/up -translate a given number into a smiley");
  reply.text("/info - displays information about the bot");
  reply.text("any message without '/' returns to the chat");
});
bot.context({ presses: 0 })
bot.command("press", (msg, reply, next) => {
  msg.context.presses++;
  reply.text("Button has been pressed.");
});

bot.command("count", (msg, reply, next) => {
  reply.text("The button has been pressed " + msg.context.presses + " times in this chat.");
});
function numberToEmoji(n) { return n + "\u20E3"; };
bot.command("up", function (msg, reply, next) {
    reply.text(msg.args(1).toString().split("").map(numberToEmoji).join(""));
});
bot.command("info", function (msg, reply, next) {
  reply.markdown("Bot " + bot.get("username")+" starting to process messages.");
  // bot.link() needs username to be set, so it also can't be called earlier
  reply.markdown("Talk to me: "+ bot.link());
});
bot.message(function (msg, reply, next) {
  try {
    reply.message(msg);
  } catch (err) {
    reply.text("Couldn't resend that.");
  }
});


bot.text(function(msg,reply,next){
    console.log("Received text",msg.text);
    mesange += " \n" + msg.text;
})

app.get('/*',function(req, res){
    // console.log('/* post')
    var dat = new Date();
    console.log(req);
    res.end(dat.toString() + "\n" + mesange)
})

