const winston = require('winston');

function getLogger(module) {
  const path = module.filename.split('/').slice(-2).join('/');

  // // your centralized logger object
  // return winston.createLogger({
  //   transports: [
  //     new (winston.transports.Console)(options.console),
  //     new (winston.transports.File)(options.errorFile),
  //     new (winston.transports.File)(options.file)
  //   ],
  //   exitOnError: false, // do not exit on handled exceptions
  // });

  return winston.createLogger({
    transports: [
      new winston.transports.Console({
        colorize: true,
        level: 'debug',
        label: path,
      }),
    ],
  });
}

module.exports = getLogger;
