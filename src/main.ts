import Database from './database';
import Server from './server';

Database.connect();
Server.start();

const shutdown = done => {
  Database.close(() => {
    Server.stop(done);
  });
};

// Nodemon
process.on('exit', shutdown.bind(null, process.exit));
process.on('SIGINT', shutdown.bind(null, process.exit));
process.on('uncaughtException', shutdown.bind(null, process.exit));
