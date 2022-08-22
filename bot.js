const { Telegraf } = require('telegraf')
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
require('dotenv').config()


var myCoins = ['cardano', 'binancecoin', 'solana', 'ethereum', 'dogecoin', 'bitcoin', 'near', 'apecoin', 'polkadot', 'matic-network', 'shiba-inu', 'ethereum-classic', 'flow'];

const bot = new Telegraf(process.env.BOT_TOKEN)

var stop = 0;

bot.command('trade', async (ctx) => {

  let market_data = await CoinGeckoClient.global();
  let market_cap_change_percentage_24h = market_data.data.data.market_cap_change_percentage_24h_usd;
  ctx.reply(`YO \n Today's market cap is : ${market_cap_change_percentage_24h} %`);

  func(myCoins, ctx);
  // const mainTO = setTimeout(func, 15000, myCoins, ctx);

})


bot.command('check', (ctx) => {
  const num = ctx.update.message.text.split(' ');  //num will store the parameter that will come with the command like "/check 12"
  const coinName = num[1];
  const coinLimit = num[2];

  console.log(coinName, coinLimit)

})

bot.command('stop', (ctx) => { stop = 1; ctx.reply(`Stop = ${stop}`) })    //When stop is enabled the main function will run only once

bot.command('resume', (ctx) => { stop = 0; ctx.reply(`Stop = ${stop}`) })  //When stop is disables the main function will run until stop is enabled 

bot.launch();


async function func(coins, ctx) {

  for (var i = 0; i < myCoins.length; i++) {
    const crypto = await CoinGeckoClient.coins.fetch(myCoins[i], {});


    const coinName = crypto.data.id;
    const one_hour_growth = crypto.data.market_data.price_change_percentage_1h_in_currency.inr;
    const coin_price = crypto.data.market_data.current_price['inr'];

    try {
      ctx.reply(one_hour_growth)
    }
    catch (err) {
      console.log(err)
    }
    // ctx.reply(`${coinName} \n Change Percentage in ${coinName} 1 hour: ${one_hour_growth} %`);

    // let a = await checkLimit('cardano', 40);
    // ctx.replyWithMarkdown(a)

    try {

      if (one_hour_growth >= 2) {
        ctx.reply(`ALERT!!! ${coinName} went up \nThe Price of ${coinName} is ${coin_price} `);
      }

      if (one_hour_growth <= -3) {
        ctx.reply(`DOWN DOWN!!! ${coinName} went DOWN \nThe Price of ${coinName} is ${coin_price} `);
      }

    } catch (error) {
      console.log(error)
    }

    ctx.reply('LOL')
  }

  if (stop === 1) {
    return
  } else
    var timeOut = setTimeout(func, 120000, coins, ctx)


}

// Give an upper limit and the coin name to the function and it will send an alert message if the coin cross the upperlimit
async function checkLimit(coin, limit) {
  const crypto = await CoinGeckoClient.coins.fetch(coin, {});

  let coindata = await CoinGeckoClient.simple.price({
    ids: [coin],
    vs_currencies: ['inr']
  });

  if (coindata.data.cardano.inr >= limit) {
    return (`Upppppppp! \n *${coin.toUpperCase()}* is finally UPPPP!`);
  }
}

// removed graceful stop
