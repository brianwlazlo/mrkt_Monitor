// IEX Cloud API 
  // will be using "Sandbox Testing" to develop app. Returns only random example data.
  // base URL for Sandbox = "https://sandbox.iexapis.com/"
    // --> Example API call = "https://sandbox.iexapis.com/stable/stock/IBM/quote?token=YOUR_TEST_TOKEN_HERE "
    //All sandbox endpoints function the same as production, so you will only need to change the base url and token


//-----MOST USEFUL FOR ACTUALLY CONSTRUCTING PRACTICAL APP ------------//
  // base URL for Paid Access = https://cloud.iexapis.com/v1/
  // API tokens must be passed with each request
  // need a "Publishable" API token
  // HTTP REQUEST
    //GET /stock/{ticker}/batch
    // ex. /stock/aapl/batch?types=quote,news,chart&range=1m&last=10
    // Query String parameters ==> "types" is REQUIRED, "symbols" is Optionable and only used with multiple tickers, "range" is Optional and only needed if chart is used in 'types' parameter
    // 'filter' can be used to return a subset of data ex. "?filter=symbol,volume,lastSalePrice" will return only these 3 data points
  // JSON is the default data format


//------MOST USEFUL URL END POINTS FOR TESTING ----//
  //Light wight Data points ... GET /data-points/{symbol}/{key} (where 'key' = Quote-LatestPrice, or Latest-Financial-Report-Date, Latest-News)
    // data-points/aapl/QUOTE-LATESTPRICE
    // OR COULD ALSO USE 'price only' ....GET /stock/{symbol}/price....will return a single number as price.
  
  // Historical Prices (to get OHLC+Volume)....GET /stock/{symbol}/chart/{range}/{date}  ex. /stock/twtr/chart/5d  OR (for what we need) /stock/twtr/chart/date/YYYMMDD 
      // OR COULD ALSO USE....Previous Day Price....GET /stock/{symbol}/previous
  
  // NEWS INFORMATION: 
    // GET.../stock/{symbol}/news/last/{#ofArticlesToReturn}. Elements to use are 'headline', 'source', 'url', 'summary', 'img'

const baseURL = "https://sandbox.iexapis.com/stable/stock"
const apiTesterToken = "Tpk_0d2324a0af6c4d1d87f32ea3445f31e8"

// get OHLC, volume, dailyRange
function getTickerPriceInfo (ticker) {
  let priceDataURL = `${baseURL}/${ticker}/previous?token=${apiTesterToken}`;

  fetch(priceDataURL)
    .then(price => price.json())
    .then(priceJson => displayPriceData(priceJson));

}

//get recent Headlines 
function getTickerNews (ticker) {
  let newsURL = `${baseURL}/${ticker}/news/last/5?token=${apiTesterToken}`;
  fetch(newsURL)
    .then(headlines => headlines.json())
    .then(headlinesJson => displayNewsHeadlines(headlinesJson));
  
}

//display OHLC, Vol, Range buttons
function displayPriceData(priceJson) {
  console.log("High: " + priceJson.high + " Low: " + priceJson.low)
}

//display news Headlines (with link, summary and pic)
function displayNewsHeadlines(headlinesJson) {

  for (let i=0; i<headlinesJson.length; i++) {
    console.log("Headline: " + headlinesJson[i].headline)
  };

}

function watchForm () {
  $('#search-form').submit(event => {
    event.preventDefault();
    let ticker = $('#ticker-symbol-search').val().toUpperCase();
    getTickerNews(ticker);
    getTickerPriceInfo(ticker);

  })
  
}

$(function() {
  console.log('App Loaded!');
  watchForm();
})

