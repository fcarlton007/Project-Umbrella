// 1. ENVIRONMENT CONFIG (MUST BE FIRST)
require('dotenv').config(); 

// 2. EXTERNAL MODULE IMPORTS (NPM Packages)
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');

// 3. LOCAL MODULE IMPORTS (Project Files)
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tradeRouter = require('./routes/trade_routes'); 
var gcpService = require('./services/gcp_service');

// 4. APP INITIALIZATION
var app = express();

// 5. MONGODB CONNECTION
const mongoURI = process.env.MONGODB_URI;
// Added a 2.5 second timeout to catch connection errors faster
mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 2500 }) 
  .then(() => {
    console.log('✅ MongoDB connection successful for Project: Umbrella.');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// 6. MIDDLEWARE
// CORS must come before routes
app.use(cors({
    origin: 'http://localhost:5173', // React frontend port
    credentials: true,
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 7. ROUTE REGISTRATION
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', tradeRouter); // This will now correctly register the router

// 8. ERROR HANDLERS (Must be last)
// Catch 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Main error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500).json({
      error: 'Server Error',
      details: err.message
  });
});

module.exports = app;