import { makeExecutableSchema } from 'apollo-server';
import { merge } from 'lodash';
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
    builder.typeDefs = [...builder.typeDefs, schema.typeDef];
    builder.resolvers = merge(builder.resolvers, schema.resolvers);
    return builder;
  },
  {
    typeDefs: [BaseQuery],
    resolvers: {},
  }
);

export default makeExecutableSchema(executableSchema);
