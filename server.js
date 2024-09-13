// Budget API

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

const budget = {
    myBudget: [
        {
            title: 'Eat out',
            budget: 25
        },
        {
            title: 'Rent',
            budget: 275
        },
        {
            title: 'Grocery',
            budget: 110
        },
    ]
};

app.get('/',express.static('public'))
app.get('/budget', (req, res) => {
    res.json(budget);
});

app.get('/hello', (req, res) => {
    res.send('Hello world!');
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});