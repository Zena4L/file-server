const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routers/userRouter');
const AppError = require('./utilis/appError');
const globalError = require('./controllers/errorController');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use('/api', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl}`, 404));
});

app.use(globalError);

module.exports = app;
