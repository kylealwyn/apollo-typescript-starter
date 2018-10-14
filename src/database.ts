import _ from 'lodash';
import Knex from 'knex';
import knexfile from '../knexfile';

class Database {
  private knexInstance: Knex;
  private config: object;

  connect(options = {}): void {
    if (this.knexInstance) {
      return;
    }
    this.config = _.merge({}, knexfile, options);
    this.knexInstance = Knex(this.config);
  }

  get query(): Knex {
    if (!this.knexInstance) {
      this.connect();
    }

    return this.knexInstance;
  }

  close(done): void {
    if (!this.knexInstance) {
      done();
      return;
    }

    this.knexInstance.destroy(done);
  }
}

export default new Database();
