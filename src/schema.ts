import { merge } from 'lodash';
import { makeExecutableSchema } from 'apollo-server';
import * as schemas from './schemas';

const BaseQuery = `
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const executableSchema = Object.values(schemas).reduce(
  (builder, schema) => {
    return {
      typeDefs: [...builder.typeDefs, schema.typeDef],
      resolvers: merge(builder.resolvers, schema.resolvers),
    };
  },
  {
    typeDefs: [BaseQuery],
    resolvers: {},
  }
);

export default makeExecutableSchema(executableSchema);
