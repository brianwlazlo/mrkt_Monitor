// IEX Cloud API 
  // will be using "Sandbox Testing" to develop app. Returns only random example data.
  // base URL for Sandbox = "https://sandbox.iexapis.com/"
    // --> Example API call = "https://sandbox.iexapis.com/stable/stock/IBM/quote?token=YOUR_TEST_TOKEN_HERE "
    //All sandbox endpoints function the same as production, so you will only need to change the base url and token



const baseURL = "https://sandbox.iexapis.com/stable/stock"
const apiTesterToken = "Tpk_0d2324a0af6c4d1d87f32ea3445f31e8"

// get company Name
function getCompanyName (ticker) {
  let companyInfo = `${baseURL}/${ticker}/company?token=${apiTesterToken}`
  console.log(companyInfo);

  fetch(companyInfo)
    .then(companyInfo => companyInfo.json())
    .then(companyInfoJson => displayCompanyName(companyInfoJson))
}

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

//display Company Name
function displayCompanyName(companyInfoJson) {
  console.log(companyInfoJson.companyName);
}


//display OHLC, Vol, Range buttons
function displayPriceData(priceJson) {
  //console.log("High: " + priceJson.high + " Low: " + priceJson.low)
}


//display news Headlines (with link, summary and pic)
function displayNewsHeadlines(headlinesJson) {

  for (let i=0; i<headlinesJson.length; i++) {
    //console.log("Headline: " + headlinesJson[i].headline)
  };

}

function watchForm () {
  $('#search-form').submit(event => {
    event.preventDefault();
    let ticker = $('#ticker-symbol-search').val().toUpperCase();
    getTickerNews(ticker);
    getTickerPriceInfo(ticker);
    getCompanyName(ticker);

  })
  
}

$(function() {
  console.log('App Loaded!');
  watchForm();
})

