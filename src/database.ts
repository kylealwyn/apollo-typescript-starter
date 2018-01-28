import * as _ from 'lodash';
import * as Knex from 'knex';
import * as knexfile from '../knexfile';

class Database {
  private knexInstance: Knex;
  private config: Object;

  public connect(options = {}): void {
    if (this.knexInstance) {
      return;
    }
    this.config = _.merge({}, knexfile, options);
    this.knexInstance = Knex(this.config);
  }

  public get query(): Knex {
    if (!this.knexInstance) {
      this.connect();
    }

    return this.knexInstance;
  }

  public close(done): void {
    if (!this.knexInstance) {
      done();
      return;
    }

    this.knexInstance.destroy(done);
  }
}

export default new Database();
