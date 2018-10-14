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
  typeDef: string;
  queries: IQueryMutation;
  mutations: IQueryMutation;
  resolvers?: object;
}

interface IRootSchema {
  typeDefs: string[];
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
    const { typeDef, queries, mutations } = schema;

    return {
      typeDefs: [...builder.typeDefs, typeDef],
      queries: [...builder.queries, resolverDefinitionsToString(queries)],
      mutations: [...builder.mutations, resolverDefinitionsToString(mutations)],
      resolvers: merge(builder.resolvers, buildResolver(schema)),
    };
  },
  {
    typeDefs: [],
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

  ${rootSchema.typeDefs.join('\n')}

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
