


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
    .then(priceDataJson => validateTicker(priceDataJson))
    .catch(err => alert(`Something went wrong. Please try again later. Error Message: ${err}`))
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
  let newsURL = `${iexBaseURL}/${ticker}/news/last/8?token=${iexApiTesterToken}`;
  console.log(newsURL);
  
  fetch(newsURL)
    .then(headlines => headlines.json())
    .then(headlinesJson => displayNewsHeadlines(headlinesJson))
    .catch(err => console.log(err));
  
}

function validateTicker(priceDataJson) {
  $('#nav-bar').removeClass('hidden');
  $('#start-screen').replaceWith('');
  if (priceDataJson['Global Quote']['08. previous close'] === undefined) {
    displayErrorMessage();
  } else {
    displayPriceData(priceDataJson);
    $('#error-message').addClass('hidden');
    $('#results').removeClass('hidden');
  }
}


function displayErrorMessage () {
  $('#error-message').removeClass('hidden');
  $('#results').addClass('hidden');
  $('#js-error-message').html('Valid ticker symbols only');
  $('#symbol-search').val('');
}

function moveSearchBar () {
  $('#form-container').removeClass('form-container').addClass('nav-bar');
  $('#search-form').removeClass('search-form').addClass('nav-search-form');
  $('#symbol-search').removeClass('symbol-search').addClass('nav-symbol-search');
  $('#search-btn').removeClass('symbol-search').addClass('nav-symbol-search');
}

//display Company Name
function displayCompanyName(companyInfoJson) {
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

  $('#symbol-search').val('');

}

//display news Headlines (with source and link)
function displayNewsHeadlines(headlinesJson) {
  moveSearchBar();

  $('#results').removeClass('hidden');
  $('#js-news-results').empty();
  
  for (let i=0; i<headlinesJson.length; i++) {
    $('#js-news-results').append(`
        <div class='article'>  
          <div class='article-details'>
            <h2 class='headline'>${headlinesJson[i].headline}</h2>
            <p class='news-source'>${headlinesJson[i].source}</p>
            <a href="${headlinesJson[i].url}" target="_blank" class='go-to-btn'>Read More</a>
          </div>
        </div>`);
  };
}


function watchForm() {
  $('#search-form').submit(event => {
    event.preventDefault();
    let ticker = $('#symbol-search').val().toUpperCase();
    getTickerNews(ticker);
    getPriceData(ticker);
    getCompanyName(ticker);
  })
  
};


$(function() {
  console.log('App Loaded!');
  watchForm();
  
});
