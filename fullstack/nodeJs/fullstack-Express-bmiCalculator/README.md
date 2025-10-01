# 🧮 BMI Calculator (Express.js)

👉 **Live Demo**: [BMI Calculator on Render](https://bmi-calculator-l52c.onrender.com/)  
👉 **GitHub Repo**: [View on GitHub](https://github.com/kkkokili/web-projects/tree/gh-pages/fullstack/nodeJs/fullstack-Express-bmiCalculator)

---

A simple **BMI Calculator** built with **Node.js + Express**, where users can input their **weight** and **height** to calculate their Body Mass Index (BMI).  
The app also provides standard BMI categories for reference.

---

## 🚀 Features

- Input **weight** and **height** via a form  
- Calculate BMI in real time on server side  
- Display results with BMI categories  
- Deployed on **Render**

---

## 📂 Project Structure

```
fullstack/nodeJs/fullstack-Express-bmiCalculator/
├─ server.js          # Main Express server
├─ bmiCalculator.html # HTML form page
├─ public/
│  ├─ style.css       # Stylesheet
│  └─ background/     # Background images
└─ README.md
```

## Installation & Run (Local)

1. Clone the repo and navigate into the folder:

   ```
   git clone https://github.com/kkkokili/web-projects.git
   cd web-projects/fullstack/nodeJs/fullstack-Express-bmiCalculator
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the server:

   ```
   node server.js
   ```

4. Open in browser:

   ```
   http://localhost:3000/bmicalculator
   ```

------

## 🌐 Deployment Notes (Render)

- Render **assigns a random port**, so **do not hardcode** the port number.
   Use:

  ```
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
  ```

- Render 默认访问 **根路径 `/`**，而你的应用主页是 `/bmicalculator`。
   建议在 `server.js` 添加一个跳转：

  ```
  app.get('/', (req, res) => {
    res.redirect('/bmicalculator');
  });
  ```

------

## 🧩 Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: HTML, CSS
