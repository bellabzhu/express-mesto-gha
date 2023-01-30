const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
mongoose.set('strictQuery', true);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function start() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb', {
      useNewUrlParser: true,
    });
    /* eslint-disable no-alert, no-console */
    app.listen(PORT, () => {
      console.log('Серверочек-то запущен!');
    });
  } catch (e) {
    console.log(e);
  }
}

start();

app.use((req, res, next) => {
  req.user = { _id: '63d7fff4cbcb122e9e0d25b6' };
  next();
});

app.get('/users', require('./routes/users'));
app.post('/users', require('./routes/users'));

app.get('/users/:id', require('./routes/users'));

app.patch('/users/me', require('./routes/users'));
app.patch('/users/me/avatar', require('./routes/users'));

app.get('/cards', require('./routes/cards'));
app.post('/cards', require('./routes/cards'));

app.delete('/cards/:cardId', require('./routes/cards'));

app.put('/cards/:cardId/likes', require('./routes/cards'));
app.delete('/cards/:cardId/likes', require('./routes/cards'));

app.get('/', (req, res) => {
  res.send('<html><h1>Privet</h1></html>');
});
