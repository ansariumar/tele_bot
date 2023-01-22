const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

var stop = 0;
var checkAlive = false;

async function func(ctx) {
  
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


}


async function checkPrice(coin, ctx) {      //perfectly fine 

  let data = await validateCoin(coin, ctx);
 
  if (data != false) 
    ctx.reply(data)

}


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


module.exports = { func, checkPrice, validateCoin }