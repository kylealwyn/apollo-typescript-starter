import { merge } from 'lodash';
import { makeExecutableSchema } from 'apollo-server';
import * as AuthorSchema from './author';
import * as BookSchema from './book';

interface IResolver {
  definition: string;
  resolve: (root: any, args?: any, context?: any, info?: any) => any;
}

interface IQueryMutation {
  [name: string]: IResolver;
}

interface ISchema {
  type: string;
  queries: IQueryMutation;
  mutations: IQueryMutation;
  resolvers?: object;
}

interface IRootSchema {
  types: string[];
  queries: string[];
  mutations: string[];
  resolvers: {
    [key: string]: any;
  };
}

const resolverDefinitionsToString = (resolvers = {}): string =>
  Object.values(resolvers)
    .map(({ definition }) => definition)
    .join('\n');

const buildResolver = (schema: ISchema): object => {
  const { queries = {}, mutations = {}, resolvers = {} } = schema;

  return {
    Query: Object.entries(queries).reduce((acc, [method, { resolve }]) => {
      acc[method] = resolve;
      return acc;
    }, {}),
    Mutation: Object.entries(mutations).reduce((acc, [method, { resolve }]) => {
      acc[method] = resolve;
      return acc;
    }, {}),
    ...resolvers,
  };
};

const schemas: ISchema[] = [AuthorSchema, BookSchema];
const rootSchema: IRootSchema = schemas.reduce(
  (builder, schema) => {
    const { type, queries = {}, mutations = {}, resolvers = {} } = schema;
    return {
      types: [...builder.types, type],
      queries: [...builder.queries, resolverDefinitionsToString(queries)],
      mutations: [...builder.mutations, resolverDefinitionsToString(mutations)],
      resolvers: merge(builder.resolvers, buildResolver(schema)),
    };
  },
  {
    types: [],
    queries: [],
    mutations: [],
    resolvers: {},
  }
);

// Construct the schema
const typeDefs = `
  type Query {
    ${rootSchema.queries.join('\n')}
  }

  type Mutation {
    ${rootSchema.mutations.join('\n')}
  }

  ${rootSchema.types.join('\n')}

  schema {
    query: Query
    mutation: Mutation
  }
`;

// Now bind it with resolers
export default makeExecutableSchema({
  typeDefs,
  resolvers: rootSchema.resolvers,
});
