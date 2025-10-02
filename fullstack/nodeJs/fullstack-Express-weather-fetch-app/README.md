# 🌦 Express Weather Fetch App

## Display:<br/>

![Farmers Market Finder Demo](gif/weather.gif)



## 📌 Live Demo

👉 [Fetch Weather](https://weather-fetch-5ksz.onrender.com/)





------

## 📖 Project Overview

This is a **Node.js + Express** full-stack mini project.
 The frontend provides a form for users to input latitude and longitude, while the backend fetches data from the **OpenWeather API** and dynamically renders weather cards to the page.

Originally, the project used **One Call v2.5 API**, but since it is now deprecated, it has been updated to use the **5-day/3-hour Forecast API**, which is available for free.

------

## 🚀 Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/kkkokili/web-projects.git
   cd web-projects/fullstack/nodeJs/fullstack-Express-weather-fetch-app
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a file `apikey.js` in the project root to store your API key:

   ```
   module.exports = "YOUR_API_KEY";
   ```

4. Start the server:

   ```
   node app.js
   ```

5. Open the app in your browser:

   ```
   http://localhost:3000
   ```

------

## 📝 Features

- Input latitude and longitude to fetch weather data.
- Fetches **current weather** and **multi-day forecasts** using the OpenWeather **Forecast API**.
- Parses JSON data and dynamically renders an HTML response containing:
  - City name and weather condition
  - Current temperature and "feels like" temperature
  - Forecast cards with date, day/night temperature, humidity, and weather icons
- Bootstrap layout: cards are displayed in **3 fixed columns** with spacing using `row g-4`.

------

## 🔑 Key Updates

- Replaced deprecated **One Call API v2.5** with **Forecast API**:

  ```
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${Weather_API_KEY}`;
  ```

- Changed card layout from `col-3` to `col-4` → ensures **3 cards per row**.

- Added `row g-4` for spacing between cards.

- Removed `.card { margin: 3rem; }` to prevent columns from breaking the layout.

------

## ⚙️ Tech Stack

- **Node.js**
- **Express.js**
- **HTTPS (Node.js built-in module)**
- **Bootstrap 5**
- **OpenWeather API**
- **HTML + CSS**

