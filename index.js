
//$('#ticker-symbol-search').val(' ');

//IEX api: used for company full name and news headlines 
const iexBaseURL = "https://sandbox.iexapis.com/stable/stock"
const iexApiTesterToken = "Tpk_0d2324a0af6c4d1d87f32ea3445f31e8"


//Alpha Vantage API: used for OHLC+Vol and Range data
const alphaVantageBaseURL = 'https://alpha-vantage.p.rapidapi.com/query?function=GLOBAL_QUOTE&symbol=';
const alphaVantageAPIKey = '0e47aaab93mshf8e9974baef0ffap104e82jsn8b5ecbdccac6';


//get OHLC+Volume and Range (Alpha Vantage API)
function getPriceData (ticker) {
  const url = `${alphaVantageBaseURL}${ticker}&datatype=json`;

  const options = {
    headers: new Headers({
      'x-rapidapi-key': alphaVantageAPIKey
    })
  };

  fetch(url, options)
    .then(priceData => priceData.json())
    .then(priceDataJson => handleBadTicker(priceDataJson))
    .catch(err => {console.error(err);});

};


// get company Name (IEX API)
function getCompanyName (ticker) {
  let companyInfo = `${iexBaseURL}/${ticker}/company?token=${iexApiTesterToken}`;
  
  fetch(companyInfo)
    .then(companyInfo => companyInfo.json())
    .then(companyInfoJson => displayCompanyName(companyInfoJson))
    .catch(err => console.log(err));
  
};

//get recent Headlines (IEX API)
function getTickerNews (ticker) {
  let newsURL = `${iexBaseURL}/${ticker}/news/last/5?token=${iexApiTesterToken}`;
  console.log(newsURL);
  
  fetch(newsURL)
    .then(headlines => headlines.json())
    .then(headlinesJson => displayNewsHeadlines(headlinesJson))
    .catch(err => console.log(err));
  
}

function handleBadTicker(priceDataJson) {
  if (priceDataJson['Global Quote']['05. price'] === undefined) {
    $('#error-message').removeClass('err-message-hidden');
    $('#results').addClass('hidden');
    $('#js-error-message').html('Valid ticker symbols only');
  } else {
    displayPriceData(priceDataJson);
    $('#error-message').addClass('err-message-hidden');
    $('#results').removeClass('hidden');
  }
}

//display Company Name
function displayCompanyName(companyInfoJson) {
  $('#results').removeClass('hidden');

  $('#company-name').html(`${companyInfoJson.companyName} (${companyInfoJson.symbol})`);
}


//display Last Price, OHL, Vol, Range
function displayPriceData(priceDataJson) {
  console.log(priceDataJson);

  let volume = priceDataJson['Global Quote']['06. volume']
  let formattedVolume = new Intl.NumberFormat().format(volume);
  let range = (priceDataJson['Global Quote']['03. high'] - priceDataJson['Global Quote']['04. low']).toFixed(2);

  $('#js-last-price').html(`${priceDataJson['Global Quote']['05. price']}`);
  $('#js-prev-close').html(`${priceDataJson['Global Quote']['08. previous close']}`);
  $('#js-open').html(`${priceDataJson['Global Quote']['02. open']}`);
  $('#js-percent-change').html(`${priceDataJson['Global Quote']['10. change percent']}`);
  $('#js-high').html(`${priceDataJson['Global Quote']['03. high']}`);
  $('#js-low').html(`${priceDataJson['Global Quote']['04. low']}`);
  $('#js-volume').html(`${formattedVolume}`);
  $('#js-range').html(`${range}`);

}


//display news Headlines (with link, summary)
function displayNewsHeadlines(headlinesJson) {
  $('#js-news-headlines').empty();
  $('#news-results').removeClass('hidden');
  for (let i=0; i<headlinesJson.length; i++) {
    $('#js-news-results').append(`
          <div class='article-details'>
            <h2 class='headline'>${headlinesJson[i].headline}</a></h2>
            <p class='news-summary'>${headlinesJson[i].summary}</p>
            <a href="${headlinesJson[i].url}" target="_blank" class='go-to-btn'>Go To Article</a>
          </div>`);
  };

}


function watchForm () {
  $('#search-form').submit(event => {
    event.preventDefault();
    let ticker = $('#ticker-symbol-search').val().toUpperCase();
    getTickerNews(ticker);
    getPriceData(ticker);
    getCompanyName(ticker);
    
  })
  
};

$(function() {
  console.log('App Loaded!');
  watchForm();
});
