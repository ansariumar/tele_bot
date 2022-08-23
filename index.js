
//1. Import coingecko-api
const CoinGecko = require('coingecko-api');

//2. Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();

const a = async() => {
let { data } = await CoinGeckoClient.coins.fetch('bitcoin', {});
    // const one_hour_growth = crypto.data.market_data.price_change_percentage_1h_in_currency.inr;
    console.log(data);
}
   

a()

// var myCoins = ['solana', 'apecoin', 'polkadot', 'polygon','flow'];


// //3. Make calls
// var func = async(coins) => {

//   // DONE:: THIS IS FOR THE WHOLE MARKET
//   // let market_cap_change_percentage_24h = await CoinGeckoClient.global();
//   // console.log(market_cap_change_percentage_24h.data.data.market_cap_change_percentage_24h_usd)

//    // const crypto = await CoinGeckoClient.coins.fetch('cardano', {});
//    // const lol = crypto.data.market_data.price_change_percentage_1h_in_currency['inr'];
//    // console.log(lol);


//   // for (var i = 0; i < myCoins.length; i++) {

//   //   const crypto = await CoinGeckoClient.coins.fetch(coins[i], {});

//   //   const coinName = crypto.data.id;
//   //   const one_hour_growth = crypto.data.market_data.price_change_percentage_1h_in_currency['inr'];
//   //   const coin_price = crypto.data.market_data.current_price['inr'];

//   //   console.log(coinName);
//   //   console.log(`Change Percentage in 1 hour: ${one_hour_growth} \n ${coin_price} `);

//   //   if (one_hour_growth >= 0.1) {
//   //     console.log(`ALERT!!! ${coinName} went up  `);
//   //     console.log(`The Price of ${coinName} is ${coin_price} `)
//   //     clearInterval(interval);
//   //   }

//   //   console.log("\n")
//   // }



//   // DONE:: FOR A SPECIFIC COIN, TODO: PUT THIS IN A FUCNTION AND PASS THE NAME OF THE COIN AS PARAMETER TO GET THE VALUE OF THE REQUSTED COIN
//   // let cardano = await CoinGeckoClient.coins.fetch('cardano', {});
//   // console.log(cardano.data.tickers[1]);                      //cardano.data.market_data.current_price['inr'], cardano.data.id, cardano.data.market_cap_rank, cardano.data.liquidity_score, cardano.data.market_data.high_24h['inr'], cardano.data.market_data.low_24h['inr'], cardano.data.market_data.price_change_percentage_1h_in_currency['inr'], price_change_percentage_24h_in_currency[inr]
//   // console.log(cardano.data.market_data.price_change_percentage_1h_in_currency['inr']);

//   // JUST SHOWS THE PRICE NOTHING MORE
//   // let data = await CoinGeckoClient.simple.price({
//   //     ids: ['avalanche', 'near', 'apecoin', 'polkadot', 'matic-network','shiba-inu','ethereum-classic', 'flow', 'ethereum-classic'],
//   //     vs_currencies: ['inr']
//   // });

//   let data = await CoinGeckoClient.simple.price({
//       ids: ['cardano'],
//       vs_currencies: ['inr']
//   });

//   console.log(data.data.cardano.inr)
 
//   // let coi = await CoinGeckoClient.coins.all();
//   // console.log(coi)
// };


// // func(myCoins);

// // var interval = setInterval(func, 9000, myCoins);
// func(myCoins)

// // 1.] coins.markets()   [  let coins = await CoinGeckoClient.coins.markets() ]
// // Use this to obtain all the coins market data (price, market cap, volume).











