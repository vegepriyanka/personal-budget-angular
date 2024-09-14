// Budget API

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

// const budget = {
//     myBudget: [
//         {
//             title: 'Eat out',
//             budget: 25
//         },
//         {
//             title: 'Rent',
//             budget: 275
//         },
//         {
//             title: 'Grocery',
//             budget: 110
//         },
//     ]
// };
const myBudgetData = require(__dirname+'/myBudget.json');


app.get('/',express.static('public'))

// app.get('/budget', (req, res) => {
//     res.json(budget);
// });

app.get('/budget', function (req, res) {
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(myBudgetData));
  })

app.get('/hello', (req, res) => {
    res.send('Hello world!');
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});