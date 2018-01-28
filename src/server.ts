import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import schema from './schema';

// Creates and configures an ExpressJS web server.
class Server {
  public express: express.Application;
  public server: http.Server;

  // Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));
  }

  // Configure API endpoints.
  private routes(): void {
    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */
    const router = express.Router();

    // The GraphQL endpoint
    router.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

    // GraphiQL, a visual editor for queries
    router.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
    this.express.use('/', router);
  }

  public start(done = () => {}): void {
    const port = process.env.PORT || 3000;

    this.server = this.express.listen(port, err => {
      if (err) {
        throw err;
      }
      console.log(`🔥 Server running on port ${port}...`); // eslint-disable-line
      done();
    });
  }

  public stop(done = () => {}): void {
    if (this.server) {
      this.server.close(done);
    }
  }
}

export default new Server();
