


//IEX api: used for company full name and news headlines 
const iexBaseURL = "https://cloud.iexapis.com/stable/stock"
const iexApiToken = "sk_cbb40c4afe044600b77e9998a6997f6e"


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
  let companyInfo = `${iexBaseURL}/${ticker}/company?token=${iexApiToken}`;
  
  fetch(companyInfo)
    .then(companyInfo => companyInfo.json())
    .then(companyInfoJson => displayCompanyName(companyInfoJson))
    .catch(err => console.log(err));
  
};

//get recent Headlines (IEX API)
function getTickerNews (ticker) {
  let newsURL = `${iexBaseURL}/${ticker}/news/last/9?token=${iexApiToken}`;
  
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


function displayCompanyName(companyInfoJson) {
  $('#company-name').html(`${companyInfoJson.companyName} (${companyInfoJson.symbol})`);
}

function stylePriceBorder(priceDataJson) {
  if (priceDataJson['Global Quote']['02. open'] > priceDataJson['Global Quote']['08. previous close']) {
    $('#js-open').parent().removeClass('border-gray').attr('class', 'border-green');
    } else {
      $('#js-open').parent().removeClass('border-gray').attr('class', 'border-red');
  };

  if (priceDataJson['Global Quote']['09. change'] < 0) {
    $('#js-percent-change').parent().removeClass('border-gray').attr('class','border-red');
    } else {
      $('#js-percent-change').parent().removeClass('border-gray').attr('class', 'border-green');
  };
}

function stylePriceColor(priceDataJson) {
  if (priceDataJson['Global Quote']['02. open'] > priceDataJson['Global Quote']['08. previous close']) {
    $('#js-open').attr('class', 'text-green');
    } else {
      $('#js-open').attr('class', 'text-red');
  };

  if (priceDataJson['Global Quote']['09. change'] < 0) {
    $('#js-percent-change').attr('class','text-red');
    } else {
      $('#js-percent-change').attr('class', 'text-green');
  };
}

//display Last Price, OHL, Vol, Range
function displayPriceData(priceDataJson) {
  moveSearchBar();
  $('#results').removeClass('hidden');
  $('footer').removeClass('hidden');

  let volume = priceDataJson['Global Quote']['06. volume'];
  let formattedVolume = new Intl.NumberFormat().format(volume)

  let lastPrice = (priceDataJson['Global Quote']['05. price']-0).toFixed(2);
  let prevClose = (priceDataJson['Global Quote']['08. previous close']-0).toFixed(2);
  let open = (priceDataJson['Global Quote']['02. open']-0).toFixed(2);
  let percentChange = ((priceDataJson['Global Quote']['09. change']/priceDataJson['Global Quote']['08. previous close'])*100).toFixed(2);
  let high = (priceDataJson['Global Quote']['03. high']-0).toFixed(2);
  let range = (priceDataJson['Global Quote']['03. high'] - priceDataJson['Global Quote']['04. low']).toFixed(2);
  let low = (priceDataJson['Global Quote']['04. low']-0).toFixed(2)

  if (lastPrice < prevClose) {
    $('#js-last-price').attr('class', 'text-red');
  } else {
    $('#js-last-price').attr('class', 'text-green');
  }
  
  stylePriceBorder(priceDataJson);
  stylePriceColor(priceDataJson);

  $('#js-last-price').html(`${lastPrice}`);
  $('#js-prev-close').html(`${prevClose}`);
  $('#js-open').html(`${open}`);
  $('#js-percent-change').html(`${percentChange}%`);
  $('#js-high').html(`${high}`);
  $('#js-low').html(`${low}`);
  $('#js-volume').html(`${formattedVolume}`);
  $('#js-range').html(`${range}`);

  $('#symbol-search').val('');

}

//display news Headlines (with source and link)
function displayNewsHeadlines(headlinesJson) {
  $('#js-news-results').empty();
  
  for (let i=0; i<headlinesJson.length; i++) {
    $('#js-news-results').append(`
        <div class='article'>  
          <div class='article-details'>
            <h3 class='headline'>${headlinesJson[i].headline}</h3>
            <p class='news-source'>Source:  ${headlinesJson[i].source}</p>
            <a href="${headlinesJson[i].url}" target="_blank" class='read-more-btn'>Read More</a>
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
