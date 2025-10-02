// jshint esversion:8
const Weather_API_KEY = require('./apikey.js'); // 导入
const express = require('express');
const app = express();
const https = require('https');

// ✅ 修正：extended（不是 entended）
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// 静态资源（保持你原有的路由）
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
app.get('/style.css', (req, res) => res.sendFile(__dirname + '/style.css'));
app.get('/style1.css', (req, res) => res.sendFile(__dirname + '/style1.css'));
app.get('/background/background.jpg', (req, res) =>
  res.sendFile(__dirname + '/background/background.jpg'),
);
app.get('/icon/icon.png', (req, res) =>
  res.sendFile(__dirname + '/icon/icon.png'),
);

// 小工具：拉取并解析 JSON（解决响应分片）
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        let raw = '';
        response.on('data', (chunk) => (raw += chunk));
        response.on('end', () => {
          try {
            const j = JSON.parse(raw || '{}');
            if (response.statusCode !== 200) {
              // 把错误体也返回，便于调试
              return reject({
                statusCode: response.statusCode,
                body: j,
              });
            }
            resolve(j);
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
}

// 表单提交：从免费端点组合出你需要的数据
app.post('/', async (req, res) => {
  try {
    const lat = Number(req.body.lat);
    const lon = Number(req.body.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return res
        .status(400)
        .send(
          '<pre>请输入正确的经纬度（数字）。例如：lat=31.2, lon=121.5</pre>',
        );
    }

    // 免费端点
    const urlCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${Weather_API_KEY}`;
    const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${Weather_API_KEY}`;

    // 并发请求
    const [current, forecast] = await Promise.all([
      fetchJson(urlCurrent),
      fetchJson(urlForecast),
    ]);

    // 当前天气
    const location =
      current.name && current.sys?.country
        ? `${current.name}, ${current.sys.country}`
        : current.name || current.sys?.country || 'Unknown';
    const currentTemperature = current.main?.temp ?? '-';
    const feelsLike = current.main?.feels_like ?? '-';
    const currentWeather = (current.weather?.[0]?.main || '').toUpperCase();
    const icon = current.weather?.[0]?.icon || '01d';
    const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    // 5天/3小时预报 → 按“日期”聚合（简易日/夜拆分）
    const byDay = {};
    for (const item of forecast.list || []) {
      const dt = new Date(item.dt * 1000);
      const dateKey = dt.toLocaleDateString('zh-cn'); // 年/月/日
      const hour = dt.getHours();
      byDay[dateKey] ||= {
        temps: [],
        nightTemps: [],
        desc: [],
        icon: item.weather?.[0]?.icon || '01d',
        humidity: [],
      };
      byDay[dateKey].temps.push(item.main?.temp);
      byDay[dateKey].humidity.push(item.main?.humidity);
      byDay[dateKey].desc.push(item.weather?.[0]?.description || '');
      if (hour >= 18 || hour < 6)
        byDay[dateKey].nightTemps.push(item.main?.temp);
    }

    // 生成卡片数据
    const avg = (arr) =>
      arr && arr.length
        ? (arr.reduce((a, b) => a + (Number(b) || 0), 0) / arr.length).toFixed(
            1,
          )
        : '-';
    const pickMid = (arr) =>
      arr && arr.length ? arr[Math.floor(arr.length / 2)] : '';

    const dayCards = Object.entries(byDay)
      .slice(0, 8)
      .map(([date, d]) => ({
        Date: date,
        DailyTemperature: avg(d.temps) !== '-' ? `${avg(d.temps)}℃` : '-',
        NightTemperature:
          avg(d.nightTemps) !== '-' ? `${avg(d.nightTemps)}℃` : '-',
        Description: pickMid(d.desc),
        Icon: `https://openweathermap.org/img/wn/${d.icon}@2x.png`,
        Humidity: avg(d.humidity) !== '-' ? avg(d.humidity) : '-',
        UVI: '-', // 免费端点没有 UVI
      }));

    // 时间显示
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(
      2,
      '0',
    )}`;

    // 页面拼装（保持你原先的结构/类名）
    let html = `
    <html lang="en" dir="ltr">
      <head>
        <meta charset="utf-8">
        <title>Fetch Weather</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Vollkorn:wght@600&display=swap" rel="stylesheet">
        <!-- bootstrap -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
        <link rel="stylesheet" href="style1.css">
      </head>
      <body>
        <h1><img id="location-icon" src="/icon/icon.png" alt="location icon"/>${location}</h1>
        <h2>${time}<span>xx</span> ${currentWeather}<img id="current-icon" src="${iconURL}" alt="weather icon"/></h2>
        <br>
        <h3>TEMP:  ${currentTemperature}℃</h3>
        <br>
        <h3>FEEL:  ${feelsLike}℃</h3>
        <br><br>
        <div class="container">
          <div class="row">`;

    for (let i = 0; i < Math.min(8, dayCards.length); i++) {
      const d = dayCards[i];
      html += `
        <div class="col-4">
        <div class="card">
          <img src="${d.Icon}" alt="weather icon"/>
          <h4>${d.Date}</h4>
          <p>${(d.Description || '').toUpperCase()}</p>
          <p>Day: ${d.DailyTemperature}</p>
          <p>Night: ${d.NightTemperature}</p>
          <p>Humidity: ${d.Humidity}%</p>
          ${d.UVI !== '-' ? `<p>UVI: ${d.UVI}</p>` : ``}
        </div></div>`;
    }

    html += `</div></div></body></html>`;
    res.send(html);
  } catch (err) {
    console.error('Weather fetch error:', err);
    const pretty =
      typeof err === 'object' ? JSON.stringify(err, null, 2) : String(err);
    res
      .status(500)
      .send(`<pre>Weather API error (free endpoints):\n${pretty}</pre>`);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server started.');
});
