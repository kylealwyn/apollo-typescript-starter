import * as _ from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';
import { getDirectories } from '../utils';

interface QueryMutation {
  [name: string]: Resolver;
}

interface Resolver {
  definition: string;
  resolve: Function;
}

interface Schema {
  type: string;
  queries: QueryMutation;
  mutations: QueryMutation;
  resolvers?: Object;
}

const directories = getDirectories(__dirname);

const schemas: Array<Schema> = directories.reduce((schemaList, directory) => {
  const schema = require(directory); // eslint-disable-line
  return [...schemaList, schema];
}, []);

const resolverDefinitionsToString = (resolvers = {}): string =>
  Object.values(resolvers)
    .map(({ definition }) => definition)
    .join('\n');

const buildResolver = (schema: Schema): Object => {
  const { queries = {}, mutations = {}, resolvers = {} } = schema;

  return {
    Query: Object.entries(queries).reduce((acc, [method, resolver]) => {
      acc[method] = resolver;
      return acc;
    }, {}),
    Mutation: Object.entries(mutations).reduce((acc, [method, resolver]) => {
      acc[method] = resolver;
      return acc;
    }, {}),
    ...resolvers,
  };
};

const { types, queries, mutations, resolvers } = schemas.reduce(
  (builder, schema) => ({
    types: `${builder.types}\n${schema.type}`,
    queries: `${builder.queries}\n${resolverDefinitionsToString(schema.queries)}`,
    mutations: `${builder.mutations}\n${resolverDefinitionsToString(schema.mutations)}`,
    resolvers: _.merge(builder.resolvers, buildResolver(schema)),
  }),
  {
    types: '',
    queries: '',
    mutations: '',
    resolvers: {},
  }
);

// Construct the schema
const typeDefs = `
  type Query {
    ${queries}
  }

  type Mutation {
    ${mutations}
  }

  ${types}

  schema {
    query: Query
    mutation: Mutation
  }
`;

// Now bind it with resolers
export default makeExecutableSchema({
  typeDefs,
  resolvers,
});
