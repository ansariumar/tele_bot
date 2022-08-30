
const { Telegraf } = require('telegraf')
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
require('dotenv').config()


var myCoins = ['cardano', 'binancecoin', 'suku', 'solana', 'ethereum', 'dogecoin', 'bitcoin', 'near', 'uniswap', 'cosmos', 'eos', 'apecoin', 'polkadot', 'matic-network', 'shiba-inu', 'ethereum-classic', 'flow'];

const bot = new Telegraf(process.env.BOT_TOKEN)

var stop = 0;
var checkAlive = false;

bot.command('trade', async (ctx) => {

    let market_data = await CoinGeckoClient.global();
    let market_cap_change_percentage_24h = market_data.data.data.market_cap_change_percentage_24h_usd;

    try {
        ctx.reply(`YO \n Today's market cap is : ${market_cap_change_percentage_24h} %`);
    } catch (err) {
        console.log(err)
    }

    func(myCoins, ctx);

})


bot.command('check', (ctx) => {
    const num = ctx.update.message.text.split(' '); //num will store the parameter that will come with the command like "/check 12"
    const coinName = num[1];
    const lowerLimit = num[2];
    const upperLimit = num[3];

    console.log(coinName, lowerLimit, upperLimit);
    checkLimit(coinName, lowerLimit, upperLimit, ctx)

})


bot.command('price', (ctx) => {
    const num = ctx.update.message.text.split(' '); //num will store the parameter that will come with the command like "/check 12"
    const coinName = num[1];

    checkPrice(coinName, ctx)

})


// bot.command('stop', (ctx) => { stop = 1; ctx.reply(`Stop = ${stop}`) })    //When stop is enabled the main function will run only once
bot.command('stop', (ctx) => {
    stop = 1;
    ctx.reply(`The Stop command was requested \n The current value of stop is :${stop} \n The /trade command will stop working in 2 minutes`)
})

bot.command('resume', (ctx) => {
    stop = 0;
    ctx.reply(`Stop = ${stop}`)
}) //When stop is disables the main function will run until stop is enabled 


bot.command('rualive', (ctx) => {

  checkAlive = true;

  setTimeout(() => {
    checkAlive = false;
    console.log(`The value of checkAlive is ${checkAlive}`)
  }, 180000)

  ctx.reply("You should get the reply 'Alive' anytime(in about 2 min) if the /trade command is running")

})

bot.launch();


async function func(coins, ctx) {
    if (checkAlive){
    	ctx.reply("lol alive")
    ctx.replyWithPhoto('https://knowyourmeme.com/memes/yes-i-am')
	}

    ctx.reply("lol")
    for (var i = 0; i < myCoins.length; i++) {
        const crypto = await CoinGeckoClient.coins.fetch(myCoins[i], {});


        const coinName = crypto.data.id;
        const one_hour_growth = crypto.data.market_data.price_change_percentage_1h_in_currency.inr;
        const one_day_growth = crypto.data.market_data.price_change_percentage_24h_in_currency.inr;
        const coin_price = crypto.data.market_data.current_price['inr'];

        // try {
        //     ctx.reply(one_hour_growth)
        // } catch (err) {
        //     console.log(err)
        // }

        try {

            if (one_hour_growth >= 2) {
                ctx.reply(`ALERT!!! ${coinName} went up by ${one_hour_growth}\nThe Price of ${coinName} is ${coin_price} \n and the ONE DAY GROWTH IS ${crypto.data.market_data.price_change_percentage_24h_in_currency.inr}`);
            }

            if (one_hour_growth <= -3) {
                ctx.reply(`DOWN DOWN!!! ${coinName} went DOWN \nThe Price of ${coinName} is ${coin_price} `);
            }

        } catch (error) {
            console.log(error)
        }

        // ctx.reply('LOL')
    }

    if (stop === 1) {
        console.log("Trade command has been stopped")
        return
    } else {
        var timeOut = setTimeout(func, 120000, coins, ctx)
    }


}

// Give an upper limit and the coin name to the function and it will send an alert message if the coin cross the upperlimit
async function checkLimit(coin, lowerLimit = Number.MIN_VALUE, upperLimit = Number.MAX_VALUE, ctx) {
    console.log("lol")
    const crypto = await CoinGeckoClient.coins.fetch(coin, {});

    const coin_price = crypto.data.market_data.current_price['inr'];

    try {

        if (coin_price >= upperLimit) {
            ctx.reply(`UPP UP \n ${coin.toUpperCase()}: ${coin_price} `);
        } else if (coin_price <= lowerLimit) {
            ctx.reply(`Fucking Down!!! \n ${coin.toUpperCase()}: ${coin_price} `);
        }

    } catch (err) {
        console.log(err)
    }


    setTimeout(checkLimit, 120000, coin, lowerLimit, upperLimit, ctx)
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
        ctx.reply(data)
}