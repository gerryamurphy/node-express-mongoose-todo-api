const app = require('./config/express'),
 			mongoose = require('mongoose'),
 			logger = require('./config/logger')(module),
 			config = require('./config/config'),
 			path = require('path'),
			errorhandler = require('errorhandler');


// Normal express config defaults
app.use(require('morgan')('dev'));
app.use(require('./app/routes'));

var isProduction = process.env.NODE_ENV === 'production';

const dbUrl = config.isTest
	? config.db.test.host
	: config.db.host;

// use promise in mongoose
mongoose.Promise = global.Promise;


if (!isProduction) {
  app.use(errorhandler());
}



if (isProduction) {
	mongoose.connect(dbUrl, {
		useMongoClient: true,
	});
} else {
	mongoose.connect(dbUrl, {
		useMongoClient: true,
	});
  mongoose.set('debug', true);
}

mongoose.connection
    .on('error', err => logger.error('Unable to connect to MongoDB:', err.message));


app.listen(config.port, () => {
    logger.info(`Running on ${config.env} mode`);
    logger.info(`Todo server listening on port ${config.port}.`);
});

module.exports = {
	app,
};
