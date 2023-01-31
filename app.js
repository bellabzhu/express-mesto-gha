const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { NOT_FOUND, OK } = require('./utils/errors');

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

app.get('/users', userRouter);
app.post('/users', userRouter);

app.get('/users/:id', userRouter);

app.patch('/users/me', userRouter);
app.patch('/users/me/avatar', userRouter);

app.get('/cards', cardRouter);
app.post('/cards', cardRouter);

app.delete('/cards/:cardId', cardRouter);

app.put('/cards/:cardId/likes', cardRouter);
app.delete('/cards/:cardId/likes', cardRouter);

app.get('/', (req, res) => {
  res.status(OK).send({ message: 'Все в порядке!' });
});

app.use('/*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена' });
});
