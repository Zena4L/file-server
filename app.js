const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const userRouter = require('./routers/userRouter');
const fileRouter = require('./routers/fileRouter');
const AppError = require('./utilis/appError');
const globalError = require('./controllers/errorController');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimiter({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

//view routes
app.get('/', (req, res) => {
  res.status(200).render('base');
});

// api route
app.use('/api/user', userRouter);
app.use('/api/file', fileRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl}`, 404));
});

app.use(globalError);

module.exports = app;
