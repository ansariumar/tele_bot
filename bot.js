const { Telegraf } = require('telegraf')
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
// const keepAlive = require('./server');
require('dotenv').config()


var myCoins = ['cardano', 'binancecoin','solana', 'ethereum', 'dogecoin', 'bitcoin'];

// , 'near', 'uniswap', 'cosmos', 'eos', 'apecoin', 'polkadot', 'matic-network', 'shiba-inu', 'ethereum-classic', 'flow', 'shping'

const bot = new Telegraf(process.env.BOT_TOKEN)

var stop = 0;
var checkAlive = false;



async function func(coins, ctx) {
  ctx.reply(myCoins.length)
  ctx.reply(myCoins)
  if (checkAlive) {
    ctx.replyWithAnimation('https://tenor.com/bbQNY.gif');
    ctx.reply("yes");
  }
  for (var i = 0; i < myCoins.length; i++) {
    const crypto = await CoinGeckoClient.coins.fetch(myCoins[i], {});


    const coinName = crypto.data.id;
    const one_hour_growth = crypto.data.market_data.price_change_percentage_1h_in_currency.usd;
    const coin_price = crypto.data.market_data.current_price['usd'];

    try {
      if (one_hour_growth >= 2) {
        ctx.reply(`ALERT!!! ${coinName} went up by ${one_hour_growth}%\nThe Price of ${coinName} is ${coin_price} `);
      }

      if (one_hour_growth <= -2) {
        ctx.reply(`DOWN DOWN!!! ${coinName} went DOWN by ${one_hour_growth}%  \nThe Price of ${coinName} is ${coin_price} `);
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


async function checkPrice(coin, ctx) {      //perfectly fine 

  let data = await validateCoin(coin, ctx);
 
  if (data != false) 
    ctx.reply(data)

}
// removed graceful stop


async function validateCoin(coin, ctx){    //perfectly fine 

  let coindata = await CoinGeckoClient.simple.price({
    ids: [coin],
    vs_currencies: ['usd']
  });
  const data = coindata.data
  // console.log(data)

  if (Object.entries(data).length === 0){
    ctx.reply(`The coin ${coin} doesn't exist. \n FuckOff`);
    return false;
  }else 
    return data;

}


// ######################------------------COMMANDS--------------##############################


bot.command('trade', async (ctx) => {

  let market_data = await CoinGeckoClient.global();
  let market_cap_change_percentage_24h = market_data.data.data.market_cap_change_percentage_24h_usd;
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
  const coin = ctx.update.message.text.split(' ');  //coin will store the parameter that will come with the command like "/price tron"
  const coinName = coin[1];

  checkPrice(coinName, ctx);

})



bot.command('add', async (ctx) => {
  const coin = ctx.update.message.text.split(' '); 
  const coinName = coin[1].toLowerCase();

  let result = await validateCoin(coinName,ctx);

  if (result != false){ 
    myCoins.push(coinName);
    ctx.reply(`"${coinName}" was added \nThe current coins are ${myCoins}`);

  }
  
})


bot.command('delete', (ctx) => {                
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




bot.launch();

// keepAlive();