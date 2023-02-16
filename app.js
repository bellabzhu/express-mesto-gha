require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors, celebrate, Joi } = require('celebrate');
const { limiter } = require('./middlewares/limiter');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { OK } = require('./utils/errors');
const Error404 = require('./errors/Error404');
const { auth } = require('./middlewares/auth');
const { regexURL } = require('./utils/constants');
const { handleErrors } = require('./middlewares/handleErrors');

const { PORT = 3000, MONGODB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
mongoose.set('strictQuery', true);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(limiter);

async function start() {
  try {
    await mongoose.connect(MONGODB_URL, {
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

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regexURL),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use('/*', (req, res, next) => {
  next(new Error404('Страница не найдена'));
});

app.use(errors());
app.use(handleErrors);
