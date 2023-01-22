const { Telegraf } = require('telegraf')
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
 const { Configuration, OpenAIApi } = require("openai");

// const { summary } = require('./test.js');
const { func, checkPrice, validateCoin } = require('./crypto.js')
require('dotenv').config()

const configuration = new Configuration({
  apiKey: "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"
});

var myCoins = ['cardano', 'binancecoin','solana', 'ethereum', 'dogecoin', 'bitcoin'];

// , 'near', 'uniswap', 'cosmos', 'eos', 'apecoin', 'polkadot', 'matic-network', 'shiba-inu', 'ethereum-classic', 'flow', 'shping'

const bot = new Telegraf(process.env.BOT_TOKEN)

var stop = 0;
var checkAlive = false;


// ######################------------------COMMANDS--------------##############################


bot.command('trade', async (ctx) => {

  let market_data = await CoinGeckoClient.global();
  let market_cap_change_percentage_24h = market_data.data.data.market_cap_change_percentage_24h_usd;
  try {
    ctx.reply(`YO \n Today's market cap is : ${market_cap_change_percentage_24h} %`);
  } catch (err) {
    console.log(err)
  }
  
  setInterval(func, 300000, ctx);

})

// ##########------This command is under maintainence -------#######
bot.command('check', (ctx) => {
  const num = ctx.update.message.text.split(' ');  //num will store the parameter that will come with the command like "/check 12"
  const coinName = num[1];
  const coinLimit = num[2];

  console.log(coinName, coinLimit)

})


bot.command('price', (ctx) => {
  const coin = ctx.update.message.text.split(' ');  //coin will store the parameter that will come with the command like "/price tron"
  const coinName = coin[1];


  checkPrice(coinName, ctx);

})


bot.command('add', async (ctx) => {
  const coin = ctx.update.message.text.split(' '); 
  const coinName = coin[1].toLowerCase();

  if(myCoins.includes(coinName)) {
    ctx.reply("This coin already exist FuckOff");
  }
  
  let result = await validateCoin(coinName,ctx);

  if (result != false){ 
    myCoins.push(coinName);
    ctx.reply(`"${coinName}" was added \nThe current coins are ${myCoins}`);

  }
  
})


bot.command('rm', (ctx) => {                
  const coin = ctx.update.message.text.split(' ');
  const coinName = coin[1].toLowerCase();

  myCoins = myCoins.filter(coin => coin != coinName);
  ctx.reply(`"${coinName}" was Deleted \nThe current coins are ${myCoins}`);
})



bot.command('stop', (ctx) => {
  stop = 1;
  ctx.reply(`The Stop command was requested \n 
    The current value of stop is :${stop} \n 
    The /trade command will stop working in 2 minutes
    Use the /resume Command to continue the undo or wait for the next instuctions`)
})




bot.command('resume', (ctx) => {
  stop = 0;
  ctx.reply(`Stop = ${stop}`)
}) //When stop is disables the main function will run until stop is enabled 



bot.command('rualive', (ctx) => {

  checkAlive = true;

  ctx.reply("You should get the reply 'Alive' anytime(run the /trade command if you don't get the reply in 2 minutes) if the bot is alive")

  setTimeout(() => {
    checkAlive = false;
  }, 360000)


})

bot.command('summa', async (ctx) => {

let text = await (ctx.update.message.text).toString();
text = text + "\n\nTl;dr"
const openai = new OpenAIApi(configuration);

console.log(text)
try {
const response = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: text,
  temperature: 0.7,
  max_tokens: 60,
  top_p: 1.0,
  frequency_penalty: 0.0,
  presence_penalty: 1,
});
 
   ctx.reply(response.data.choices[0].text) 

 } catch(error) {
   console.log(error)
 }
// ctx.reply(response.data.choices[0].text) 
 // console.log("THis  IS FROM CHATGPT \n\n" + response.data.choices[0].text)
})

bot.launch();

// keepAlive();