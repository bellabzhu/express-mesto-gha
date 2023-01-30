const express = require('express');

const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const { PORT = 3000 } = process.env;

const app = express();

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
// app.get('/users') // возвращает всех пользователей

// app.get('/users/:userId') //возвращает пользователя по _id

// app.post('/users') // создаёт пользователя
// // передайте JSON-объект с тремя полями: name, about и avatar.


