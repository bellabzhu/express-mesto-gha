const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

mongoose.set('strictQuery', true);

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function start() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb', {
      useNewUrlParser: true,
    });
    app.listen(PORT, () => {
      console.log('Серверочек-то запущен!');
    });
  } catch (e) {
    console.log(e);
  }
}

start();

app.get('/users', require('./routes/users'));
app.get('/users/:id', require('./routes/users'));
app.post('/users', require('./routes/users'));

app.get('/', (req, res) => {
  res.send(`<html><h1>Privet</h1></html>`);
});


// 63d7fff4cbcb122e9e0d25b6