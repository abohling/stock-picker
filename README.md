# stock-picker

Stock-pick is an app that is geared toward the financial professional. The easy search and detail function lets you look up real-time data and analysis. Using API endpoints from >https://www.alphavantage.co/documentation/#intraday-extended, allows you to immerse yourself into each company's financials fully.

## Working problems
Currently, it works locally but runs off older software that isn't supported by Heroku so can't be hosted. Also, you are unable to search for more than 6 stocks within a 5-minute period due to API limitations.

## Features

- Look up any us traded stock
- Live time data
- Financial balance sheets
- Live news feeds for every stock

This project runs off an SQLite database. The database uses class methods to hash passwords, authenticate users, and authenticate searches. It is a lightweight relational database that is connected between users and the stocks that they favor. 

<img width="1432" alt="Screenshot 2023-07-20 at 1 43 17 PM" src="https://github.com/abohling/stock-picker/assets/98919815/1b906c98-7c90-40e5-90c1-022adbfdb835">

Here you can search for any US stock ticker. It will convert any uppercase and lowercase searched terms into readable queries for the Yahoo Finance API. After searching you will get a section that contains the searched terms' most up-to-date data. You can click on the stock ticker button to get more in-depth information.
<img width="1436" alt="Screenshot 2023-07-20 at 1 43 59 PM" src="https://github.com/abohling/stock-picker/assets/98919815/70e0ad70-c1bd-437b-8770-8b4213d6d9c3">

The stock tickers landing page will hold a plethora of information. You will be able to chart out the stock price in 5-minute increments, and get a live news feed of the searched stock, profit and loss, and other historical information.

<img width="1435" alt="Screenshot 2023-07-20 at 1 44 27 PM" src="https://github.com/abohling/stock-picker/assets/98919815/c8a908f4-942d-4236-9489-0d9783dbf54f">

-stock news feed.
<img width="1432" alt="Screenshot 2023-07-20 at 1 44 38 PM" src="https://github.com/abohling/stock-picker/assets/98919815/d08cb34b-4ef8-49a2-9b64-b87374c51944">

