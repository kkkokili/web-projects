// jshint esversion:7
const express=require('express');

const app=express();

app.use(express.urlencoded({extended:true}));

app.get('/bmicalculator', (req, res)=> {
  res.sendFile(__dirname+"/bmiCalculator.html");
});

app.get('/style.css', (req, res) => {
  res.sendFile(__dirname+"/style.css");
});

app.get("/background/5333978.jpg", (req, res) => {
  res.sendFile(__dirname+'/background/5333978.jpg');
});


app.post('/bmicalculator', (req, res)=> {
  let weight=Number(req.body.weight);
  let height=Number(req.body.height);
  let BMI = weight/(height**2);
  res.send(`<body style="text-align: center;
                         margin-top: 15%;
                         background-image: url(/background/5333978.jpg);
                         font-family: sans-sarif;
                         color: #3A6351;
                         ">
            <h1 style="font-size: 2rem;";>Your BMI is ${BMI}</h1>
            <br>
            <h3>BMI Categories :</h3>
            <h3>Underweight = <18.5</h3>
            <h3>Normal weight = 18.5–24.9</h3>
            <h3>Overweight = 25–29.9</h3>
            <h3>Obesity = BMI of 30 or greater</h3>
            </body> `);
    });

app.listen(3000, ()=> {
  console.log('The port now starts to listen!');
});
