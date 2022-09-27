const { Telegraf } = require('telegraf')
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
// const keepAlive = require('./server');
require('dotenv').config()


var myCoins = ['cardano', 'binancecoin', 'ethereum-classic', 'apecoin', 'solana', 'ethereum', 'dogecoin', 'bitcoin'];

// , 'near', 'uniswap', 'cosmos', 'eos', 'apecoin', 'polkadot', 'matic-network', 'shiba-inu', 'ethereum-classic', 'flow', 'shping'

const bot = new Telegraf(process.env.BOT_TOKEN)

var stop = 0;
var checkAlive = false;



async function func(coins, ctx) {

  if (checkAlive) {
    ctx.reply("alive M i")
    ctx.replyWithPhoto('https://knowyourmeme.com/memes/yes-i-am')
  }
  for (var i = 0; i < myCoins.length; i++) {
    const crypto = await CoinGeckoClient.coins.fetch(myCoins[i], {});


    const coinName = crypto.data.id;
    const one_hour_growth = crypto.data.market_data.price_change_percentage_1h_in_currency.inr;
    const coin_price = crypto.data.market_data.current_price['inr'];

    try {
      if (one_hour_growth >= 1) {
        ctx.reply(`ALERT!!! ${coinName} went up by ${one_hour_growth}%\nThe Price of ${coinName} is ${coin_price} `);
      }

      if (one_hour_growth <= -0.6) {
        ctx.reply(`DOWN DOWN!!! ${coinName} went DOWN  \nThe Price of ${coinName} is ${coin_price} `);
      }

    } catch (error) {
      console.log("We Got the error SIR:  " + error)
    }

  }

  if (stop === 1) {
    ctx.reply("The /trade command has stopped \n Use the /resume command to use the /trade command again")
    return
  }
  else
    var timeOut = setTimeout(func, 300000, coins, ctx)

}


async function checkPrice(coin, ctx) {

  let coindata = await CoinGeckoClient.simple.price({
    ids: [coin],
    vs_currencies: ['inr']
  });

  const data = coindata.data

  if (Object.entries(data).length === 0)
    ctx.reply(`The Coin named ${coin} doesn't exist \n Kindly fuckOff`)
  else
    ctx.reply(data )
}
// removed graceful stop




// ######################------------------COMMANDS--------------##############################


bot.command('trade', async (ctx) => {

  let market_data = await CoinGeckoClient.global();
  let market_cap_change_percentage_24h = market_data.data.data.market_cap_change_percentage_24h_inr;
  try {
    ctx.reply(`YO \n Today's market cap is : ${market_cap_change_percentage_24h} %`);
  } catch (err) {
    console.log(err)
  }
  func(myCoins, ctx);
  // const mainTO = setTimeout(func, 15000, myCoins, ctx);

})

// ##########------This command is under maintainence -------#######
bot.command('check', (ctx) => {
  const num = ctx.update.message.text.split(' ');  //num will store the parameter that will come with the command like "/check 12"
  const coinName = num[1];
  const coinLimit = num[2];

  console.log(coinName, coinLimit)

})


bot.command('price', (ctx) => {
  const num = ctx.update.message.text.split(' ');  //num will store the parameter that will come with the command like "/check 12"
  const coinName = num[1];

  checkPrice(coinName, ctx)

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
  }, 180000)


})




bot.launch();

// keepAlive();