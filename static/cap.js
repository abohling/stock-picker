const BASE_URL = "https://www.alphavantage.co/query?";

const AKEY = "16BU8NH1BF15DGXD";
$stockId = $("#stockId");
$search = $("#search");
$searchForm = $("#searchForm");
$starter = $("#starter");

//for the search function and route to stock detail page

async function stockGeneralInfo(term) {
  const response = await axios({
    url: `${BASE_URL}function=GLOBAL_QUOTE&symbol=${term}&apikey=${AKEY}`,
    method: "GET",
  });

  let stock = {
    symbol: response.data["Global Quote"]["01. symbol"],
    price: response.data["Global Quote"]["05. price"],
    dailyPointsChange: response.data["Global Quote"]["09. change"],
    dailyChange: response.data["Global Quote"]["10. change percent"],
    dailyHigh: response.data["Global Quote"]["03. high"],
    dailyLow: response.data["Global Quote"]["04. low"],
    DateOfPrice: response.data["Global Quote"]["07. latest trading day"],
  };

  return stock;
}

function populateStockDetails(stock) {
  $stockId.empty();
  $starter.remove();

  if (stock.symbol === undefined) {
    const failedstock = $(
      `<div class="failed">
        <p>Entered Stock Symbol Is Not A US Stock</p>
      </div`
    );
    $stockId.append(failedstock);
  } else {
    const $stock = $(
      `<div class= "signupcontainer">
        <form id="stockform" action="/stockdetails">
            <input class="btn btn-primary" type="submit" name="stockinfo" id="stockSym" value="${stock.symbol}">
            <br>
            <label for="stockinfo">Date: ${stock.DateOfPrice}</label>
            <br>
            <label for="stockinfo">Last Price: ${stock.price}</label>
            <br>
            <label for="stockinfo">Daily High: ${stock.dailyHigh}</label>
            <br>
            <label for="stockinfo">Daily Low: ${stock.dailyLow}</label>
            <br>
            <label for="stockinfo">Daily Change: ${stock.dailyPointsChange}</label>
            <br>
            <label for="stockinfo">Daily Percent Change: ${stock.dailyChange}</label>
        </form>
    </div>`
    );
    $stockId.append($stock);
  }
}

async function searchForShowAndDisplay() {
  const searchTerm = $("#search").val();
  const stock = await stockGeneralInfo(searchTerm);

  populateStockDetails(stock);

  $("#stockSym").on("click", async (evt) => {
    const symbolSeached = $("#stockSym").val();
    $("#stockform").submit();
  });
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

//////// button for favorites    ///////

//////// api links for each stock map,balance sheet, news

async function getDailyStockData(term) {
  const response = await axios({
    url: `${BASE_URL}function=TIME_SERIES_INTRADAY&symbol=${term}&interval=5min&apikey=${AKEY}`,
    method: "GET",
  });
  let wholechart = [];
  let time = [];
  let high = [];
  let low = [];
  let open = [];
  let closedat = [];
  for (let x in response.data["Time Series (5min)"]) {
    closedat.push(response.data["Time Series (5min)"][x]["4. close"]);
    high.push(response.data["Time Series (5min)"][x]["2. high"]);
    low.push(response.data["Time Series (5min)"][x]["3. low"]);
    low.push(response.data["Time Series (5min)"][x]["1. open"]);
    wholechart.push(response.data["Time Series (5min)"][x]);
    time.push(x);
  }

  let myChart = document.getElementById("myChart").getContext("2d");

  let stockChart = new Chart(myChart, {
    type: "line",
    data: {
      labels: time,
      datasets: [
        {
          label: "price in 5min Series",
          data: closedat,
        },
      ],
    },
    options: {},
  });
}

function populateApiDetails() {
  // $("#apiInfoConatiner").empty();
  let stocksym = [];
  const urlParams = new URLSearchParams(location.search);
  for (let [key, value] of urlParams) {
    stocksym.push(value);
  }
  return stocksym;
}

async function getQueryInfo() {
  searchapi = populateApiDetails();
  stockWithApi = await getDailyStockData(searchapi);
}

$("#chartslink").on("click", async function (evt) {
  evt.preventDefault();
  $("#apiInfoConatiner").empty();
  const $chart = $(`
  <canvas id="myChart"></canvas>
  `);
  $("#apiInfoConatiner").append($chart);

  await getQueryInfo();
});

///// creating a balance sheet from api and display form /////
function extractKey(arr, key) {
  return arr.map(function (val) {
    return val[key];
  });
}
async function balanceSheetInfo(term) {
  const response = await axios({
    url: `${BASE_URL}function=BALANCE_SHEET&symbol=${term}&apikey=${AKEY}`,
    method: "GET",
  });

  anReport = response.data.annualReports;
  quartReport = response.data.quarterlyReports;

  anheaders = [
    "Fiscal Date Ending",
    "Reported Currency",
    "Total Assets",
    "Total Current Assets",
    "Cash And Cash Equivalents At Carrying Value",
    "Cash And Short Term Investments",
    "Inventory",
    "Current Net Receivables",
    "Total Non Current Assets",
    "Property Plant Equipment",
    "Accumulated Depreciation Amortization PPE",
    "Intangible Assets",
    "Intangible Assets Excluding Goodwill",
    "Goodwill",
    "Investments",
    "Long Term Investments",
    "Short Term Investments",
    "Other Current Assets",
    "Other Non Current Assets",
    "Total Liabilities",
    "Total Current Liabilities",
    "Current Accounts Payable",
    "Deferred Revenue",
    "current Debt",
    "Short Term Debt",
    "Total Non Current Liabilities",
    "Capital Lease Obligations",
    "Long Term Debt",
    "Current Long Term Debt",
    "Long Term Debt Noncurrent",
    "Short Long Term Debt Total",
    "Other Current Liabilities",
    "Other Non Current Liabilities",
    "Total Shareholder Equity",
    "Treasury Stock",
    "Retained Earnings",
    "Common Stock",
    "Common Stock Shares Outstanding",
  ];

  // anheader = Object.keys(anReport[1]);
  console.log(anheaders);

  let table = document.createElement("table");
  let headerRow = document.createElement("tr");

  anheaders.forEach((headerText) => {
    let header = document.createElement("th");
    let textNode = document.createTextNode(headerText);
    header.appendChild(textNode);
    headerRow.appendChild(header);
  });

  table.appendChild(headerRow);

  anReport.forEach((year) => {
    let row = document.createElement("tr");

    Object.values(year).forEach((text) => {
      let cell = document.createElement("td");

      cell.innerText = text;

      row.appendChild(cell);
    });
    table.appendChild(row);
  });

  $("#apiInfoConatiner").append(table);
  $("table").first().addClass("apiTable");
  $("#apiInfoContainer");
}

$("#balancelink").on("click", async function (evt) {
  evt.preventDefault();
  await getBalanceInfo();
  $("#apiInfoConatiner").empty();
  $("#myChart").empty();
});

async function getBalanceInfo() {
  searchapi = populateApiDetails();
  balanceSheetInfo(searchapi);
}

//news articles api sorted by the last 50 searched

// https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&sort=LATEST&apikey=16BU8NH1BF15DGXD

async function newsFeedDetail(term) {
  const response = await axios({
    url: `${BASE_URL}function=NEWS_SENTIMENT&tickers=${term}&sort=LATEST&apikey=${AKEY}`,
    method: "GET",
  });
  newsFeed = response.data.feed;

  for (let article of newsFeed) {
    $("#apiInfoConatiner").append(
      `<div class="articlewrapper">
        <h2>${article.title}</h2>
        <p>${article.summary}</p>
        <a href= ${article.url}>${article.title}</a>
      </div>`
    );
    console.log(article);
  }
}

$("#newslink").on("click", async function (evt) {
  evt.preventDefault();
  $("#apiInfoConatiner").empty();
  await getNewsInfo();
});

async function getNewsInfo() {
  searchapi = populateApiDetails();
  newsFeedDetail(searchapi);
}
