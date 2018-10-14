import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import { ApolloServer } from 'apollo-server-express';
import schema from './schema';

const apollo = new ApolloServer({ schema });

// Creates and configures an ExpressJS web server.
class Server {
  app: express.Application;
  server: http.Server;

  // Run configuration methods on the Express instance.
  constructor() {
    this.app = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  middleware() {
    this.app.use(logger('dev'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    apollo.applyMiddleware({
      app: this.app,
    });
  }

  // Configure API endpoints.
  routes() {
    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */
    const router = express.Router();

    this.app.use('/', router);
  }

  start(cb = () => null) {
    const port = process.env.PORT || 3000;

    this.server = this.app.listen(port, err => {
      if (err) {
        throw err;
      }
      console.log(`🔥 Server running on port ${port}...`); // eslint-disable-line
      cb();
    });
  }

  stop(cb = () => null) {
    if (this.server) {
      this.server.close(cb);
    }
  }
}

export default new Server();
